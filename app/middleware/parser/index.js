const path = require('path');

const multipartParser = require('./multipartParser');
const schemaParser = require('./schemaParser');
const configParser = require('./configParser');
const folderParser = require('./folderParser');
const ControllerHelper = require('../../common/controllerHelper');
const logger = require('../../common/logger');
const filer = require('../../common/filer');
const constants = require('../../common/constants');
const helper = require('../../common/helper');

class Parser {
  async parseMultipart(req, res, next) {
    try {
      const { jsonData, fileData } = await multipartParser.parseRequestData(req);
      Object.assign(req.body, jsonData);
      req.body.fileData = fileData;
      if (next) next();
    } catch (errorMessage) {
      new ControllerHelper(res).sendErrorResponse({
        code: constants.httpCodes.badRequest,
        result: {
          message: errorMessage,
        },
      });
    }
  }

  async parseSchema(req, res, next) {
    const detectDatatypes = req.query.detectDatatypes === 'true';
    const normalizeTitles = req.query.normalizeTitles === 'true';

    await Parser.prototype.parseMultipart(req, res);
    if (!req.body.fileData) return next();

    try {
      req.body.columns = await schemaParser.parseSchemaFile(req.body.fileData, detectDatatypes, normalizeTitles);
      req.body.fileName = `${req.body.name}.csv`;
      next();
    } catch (error) {
      logger.warning('Cannot parse schema file - ', error);

      if (typeof error === 'string') {
        new ControllerHelper(res).sendErrorResponse({
          code: constants.httpCodes.badRequest,
          result: {
            message: error,
          },
        });
      } else {
        new ControllerHelper(res).sendErrorResponse({
          code: constants.httpCodes.internalServerError,
        });
      }
    }
  }

  async parseConfig(req, res, next) {
    await Parser.prototype.parseMultipart(req, res);
    if (!req.body.fileData) return next();

    try {
      const configData = await configParser.parseConfigFile(req.body.fileData.path);
      Object.assign(req.body, configData);
      next();
    } catch (error) {
      logger.warning('Cannot parse config file - ', error);

      new ControllerHelper(res).sendErrorResponse({
        code: constants.httpCodes.badRequest,
        message: error.message,
      });
    }
  }

  async parseAppFolder(req, res, next) {
    await Parser.prototype.parseMultipart(req, res);
    if (!req.body.fileData) return next();

    const detectDatatypes = req.query.detectDatatypes === 'true';
    const normalizeTitles = req.query.normalizeTitles === 'true';
    const appFormat = req.query.appFormat ? req.query.appFormat : constants.types.appFormat.normal;
    let folderPath;
    try {
      const { folderData, tablePaths, configPaths } = await folderParser.parseAppFolderArchive(req.headers.authorization,
        req.body.fileData, appFormat);
      folderPath = folderData.path;
      const tableData = {};
      // Parse the config files into a single combined object
      const config = await configParser.parseConfigFiles(configPaths);
      // Parse the table and column data with metadata defined by table config if exists, otherwise create the metadata from csv file
      if (config.tables) {
        await Promise.all(config.tables.map(async (table) => {
          const fileName = table.fileName ? table.fileName.replace(path.extname(table.fileName), '') : table.name;
          const tablePath = tablePaths.find(p => path.basename(p).replace(path.extname(p), '') === fileName);
          if (!tablePath) return;
          tableData[table.name] = {
            path: tablePath,
            columns: await schemaParser.parseCsv(tablePath, false, false),
          };
        }));
      }
      if (tablePaths && tablePaths.length) {
        const tables = [];
        await Promise.all(tablePaths.map(async (tablePath, index) => {
          if (Object.values(tableData).find(table => table.path === tablePath) || path.extname(tablePath) !== '.csv') return;
          const tableName = path.basename(tablePath).replace('.csv', '');
          tables[index] = {
            name: tableName,
            displayName: normalizeTitles ? helper.parseName(tableName) : tableName,
            type: path.basename(path.dirname(tablePath)),
            ...constants.defaultProperties.table,
            columns: await schemaParser.parseCsv(tablePath, detectDatatypes, normalizeTitles),
          };
          tableData[tableName] = {
            path: tablePath,
            columns: tables[index].columns,
          };
        }));
        // Combine tables with config and tables without config ('tables' contains undefined values sometimes, which are to be filtered out)
        config.tables = [].concat(config.tables, tables).filter(t => !!t);
      }
      Object.assign(req.body, { folderData, config, tableData });
      next();
    } catch (error) {
      logger.warning('Cannot parse app folder - ', error);

      if (folderPath) await filer.deleteDirectory(folderPath);
      new ControllerHelper(res).sendErrorResponse({
        code: constants.httpCodes.badRequest,
        result: {
          message: error && error.constructor === String ? error : constants.application.create.parseError,
        },
      });
    }
  }

  async parseZipFolder(req, res, next) {
    await Parser.prototype.parseMultipart(req, res);
    if (!req.body.fileData) return next();

    try {
      // Parse the uploaded folder archive and attach folder data to request body
      req.body.folderData = await folderParser.parseFolderArchive(req.body.fileData);
      next();
    } catch (error) {
      logger.warning('Cannot parse app folder - ', error);

      if (req.body.folderData) await filer.deleteDirectory(req.body.folderData.path);
      new ControllerHelper(res).sendErrorResponse({
        code: constants.httpCodes.badRequest,
        result: {
          message: error && error.constructor === String ? error : constants.parser.parseFolderError,
        },
      });
    }
  }
}

module.exports = new Parser();
