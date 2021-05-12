
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { Builder, Parser } = require('xml2js');
const config = require('config');

const commonServices = require('../common');
const filer = require('../../common/filer');
const helper = require('../../common/helper');
const RequestHelper = require('../../common/requestHelper');

class TableauManager {
  constructor(appId, tableauDetails) {
    this._appId = appId;
    this.config = tableauDetails;
  }

  async signIn() {
    if (!this.config) this.config = await commonServices.global.getTableauSettings();
    const credentials = {
      name: this.config.username,
      password: this.config.password,
      site: {
        contentUrl: this.config.siteContentUrl,
      },
    };

    const response = await new RequestHelper()
      .post
      .url(`${this.config.server}${config.tableau.api.base}${config.tableau.api.signIn}`)
      .headers({ accept: 'application/json' })
      .data({ credentials })
      .makeRequest();
    const baseURL = `${this.config.server}${config.tableau.api.base}/sites/${response.data.credentials.site.id}/`;

    if (this._appId) this.appDbConfig = (await commonServices.application.getApplicationData(this._appId)).database;
    this.requestHelper = new RequestHelper(baseURL, {
      accept: 'application/json',
      'X-Tableau-Auth': response.data.credentials.token,
    });
    return this;
  }

  async _uploadLargeFile(filePath) {
    if (!this.requestHelper) await this.signIn();
    // Tableau max block size is 64 MB below which the file upload does not need to happend separately
    const blockSize = 64 * 1024 * 1024;
    const { size } = await filer.getStats(filePath);
    const blockCount = Math.ceil(size / blockSize);
    // If the file is not large, return so that the resource can be published through a single request
    if (blockCount === 1) return;
    // Make the initial request to create an upload session
    const initialResponse = await this.requestHelper.post.url('fileUploads').makeRequest();
    const { uploadSessionId } = initialResponse.data.fileUpload;
    // Upload the file, one block at a time
    for (let index = 0; index < blockCount; index += 1) {
      const end = index === blockCount - 1 ? size - 1 : (index + 1) * blockSize - 1;
      const blockStream = fs.createReadStream(filePath, { start: index * blockSize, end });
      const form = new FormData();
      form.append('request_payload', '', { 'Content-Type': 'text/xml' });
      form.append('tableau_file', blockStream, { 'Content-Type': 'application/octet-stream' });
      await this.requestHelper
        .put
        .url(`fileUploads/${uploadSessionId}`)
        .headers({ 'Content-Type': `multipart/mixed; boundary=${form.getBoundary()}` })
        .data(form)
        .makeRequest();
    }
    return uploadSessionId;
  }

  _getPublishPayload(workbookName) {
    return new Builder({ headless: true }).buildObject({
      tsRequest: {
        workbook: {
          $: { name: workbookName },
          connections: {
            connection: {
              $: { serverAddress: this.config.databaseServer, serverPort: config.database.postgres.port },
              connectionCredentials: {
                $: { name: this.appDbConfig.roles.readOnly.dbusername, password: this.appDbConfig.roles.readOnly.dbpassword, embed: true },
              },
            },
          },
          project: {
            $: { id: this.config.projectId },
          },
        },
      },
    });
  }

  async _setDataSource(filePath) {
    const tempDirName = helper.getRandomString(10, [helper._passwordSources.alphaLower]);
    const extractedPath = `/tmp/${tempDirName}`;
    await filer.extractFile(filePath, extractedPath);

    const { files: [xmlPath] } = await filer.getDirectoryTree(extractedPath);
    const xml = await filer.readFile(xmlPath);
    const { workbook } = await new Parser({ explicitArray: false }).parseStringPromise(xml);

    if (!workbook.datasources) return;
    if (!workbook.datasources.datasource.length) workbook.datasources.datasource = [workbook.datasources.datasource];

    workbook.datasources.datasource.forEach(datasource => {
      if (!datasource.connection) return;
      datasource.connection['named-connections']['named-connection'].connection.$.server = this.config.databaseServer;
      datasource.connection['named-connections']['named-connection'].connection.$.dbname = this.appDbConfig.databaseName;
      datasource.connection['named-connections']['named-connection'].connection.$.username = this.appDbConfig.roles.readOnly.dbusername;
    });

    const updatedXml = new Builder({ headless: true }).buildObject({ workbook });
    await filer.writeFile(xmlPath, updatedXml);
    await filer.compressToArchive(filePath, xmlPath);
    filer.deleteDirectory(extractedPath);
  }

  async publishWorkbook(filePath) {
    if (!this.requestHelper) await this.signIn();
    await this._setDataSource(filePath);

    const workbookName = path.basename(filePath).split('.')[0];
    const form = new FormData();

    const fileStream = fs.createReadStream(filePath);
    const requestPayload = this._getPublishPayload(workbookName);

    const uploadSessionId = await this._uploadLargeFile(filePath);
    form.append('request_payload', requestPayload, { 'Content-Type': 'text/xml' });
    if (!uploadSessionId) form.append('tableau_workbook', fileStream, { 'Content-Type': 'application/octet-stream' });

    return this.requestHelper
      .post
      .url('workbooks')
      .params({ overwrite: true, workbookType: 'twbx', uploadSessionId })
      .headers({ 'Content-Type': `multipart/mixed; boundary=${form.getBoundary()}` })
      .data(form)
      .makeRequest();
  }

  async getProjectId(name) {
    if (!this.requestHelper) await this.signIn();

    const workbookAPI = `projects?filter=name:eq:${name}`;
    return this.requestHelper
      .url(workbookAPI)
      .makeRequest()
      .then((response) => {
        return response.data.pagination.totalAvailable > 0 && response.data.projects.project[0].id;
      });
  }

  async _getWorkbookDetails(workbook) {
    if (!this.requestHelper) await this.signIn();

    const workbookAPI = `workbooks?filter=name:eq:${workbook}`;

    const { data } = await this.requestHelper.url(workbookAPI).makeRequest();
    return !!data.workbooks.workbook && data.workbooks.workbook[0];
  }

  async downloadWorkbook(workbook, filePath) {
    if (!this.requestHelper) await this.signIn();

    const workbookDetails = await this._getWorkbookDetails(workbook.workbook);
    if (workbookDetails && workbook.url.includes(`/${workbookDetails.contentUrl}`)) {
      const downloadAPI = `workbooks/${workbookDetails.id}/content`;
      return this.requestHelper
        .url(downloadAPI)
        .downloadFile(filePath);
    }
  }
}

module.exports = TableauManager;
