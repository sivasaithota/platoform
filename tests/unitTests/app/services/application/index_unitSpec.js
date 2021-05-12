const sinon = require('sinon');
const filer = require('../../../../../app/common/filer');
const { expect } = require('../../../base');
const applicationService = require('../../../../../app/services/application');
const commonServices = require('../../../../../app/services/common');
const logger = require('../../../../../app/common/logger');
const applicationDataService = require('../../../../../app/dataServices/application');
const mockData = require('./mockData');
const helper = require('../../../../../app/common/helper');
const deploymentService = require('../../../../../app/services/deployment');

describe('getApplications', () => {
  let getApplicationsDataServiceStub;

  beforeEach(() => {
    getApplicationsDataServiceStub = sinon.stub(applicationDataService, 'getApplications');
  });
  afterEach(() => {
    getApplicationsDataServiceStub.restore();
  });

  it('should return all the apps sent from data service', async () => {
    getApplicationsDataServiceStub = getApplicationsDataServiceStub.returns(mockData.getApplications);
    const result = await applicationService.getApplications(mockData.query);
    expect(getApplicationsDataServiceStub.getCall(0).args[0]).to.deep.equal(mockData.result.getApplications[0]);
    expect(getApplicationsDataServiceStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.getApplications);
  });

  it('should return all the apps sent from data service even with empty query object', async () => {
    getApplicationsDataServiceStub = getApplicationsDataServiceStub.returns(mockData.getApplications);
    const result = await applicationService.getApplications({});
    expect(getApplicationsDataServiceStub.getCall(0).args[0]).to.deep.equal(mockData.result.getApplications[1]);
    expect(getApplicationsDataServiceStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.getApplications);
  });

  it('should return all the apps sent from data service', async () => {
    getApplicationsDataServiceStub = getApplicationsDataServiceStub.returns(mockData.getApplications);
    const result = await applicationService.getApplications(mockData.query);
    expect(getApplicationsDataServiceStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.getApplications);
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Application Data Services');
    getApplicationsDataServiceStub = getApplicationsDataServiceStub.throws(error);
    const errorLogger = sinon.stub(logger, 'error');
    try {
      await applicationService.getApplications({});
    } catch (err) {
      expect(err).to.equal(error);
    }
    errorLogger.restore();
  });
});

describe('updateApplication', () => {
  let updateApplicationDataServiceStub;

  beforeEach(() => {
    updateApplicationDataServiceStub = sinon.stub(applicationDataService, 'updateApplication');
    sinon.stub(helper, 'encryptPassword').returns(mockData.appObject[0].login.password);
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should retreive from application data service to update action', async () => {
    updateApplicationDataServiceStub = updateApplicationDataServiceStub.returns(mockData.result.updateOne);
    const result = await applicationService.updateApplication(mockData.paramsObject, mockData.appObject[0], mockData.userObject);
    expect(updateApplicationDataServiceStub.calledOnce).to.be.true;
    expect(result).to.deep.equal({ ok: true });
  });

  it('should call the application data service to update Action with right argument', async () => {
    updateApplicationDataServiceStub = updateApplicationDataServiceStub.returns(mockData.result.updateOne);
    await applicationService.updateApplication(mockData.paramsObject, mockData.appObject[0], mockData.userObject);
    expect(updateApplicationDataServiceStub.getCall(0).args[0]).to.equal(mockData.paramsObject.appId);
    expect(updateApplicationDataServiceStub.getCall(0).args[1]).to.have.all.keys(mockData.properties.updateApplication);
  });

  it('should throw error that is thrown from data Service for get Tags', async () => {
    const error = new Error('Application Data Services');
    updateApplicationDataServiceStub = updateApplicationDataServiceStub.throws(error);
    const errorLogger = sinon.stub(logger, 'error');
    try {
      await applicationService.updateApplication(mockData.paramsObject, mockData.actionObject, mockData.userObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
    errorLogger.restore();
  });
});

describe('createApplication()', () => {
  let createApplicationDataServiceStub;
  let createAppDirectoryFilerStub;
  let createDefaultParameterGroupStub;
  let updateApplicationDataServiceStub;
  let copyFileFiler;

  beforeEach(() => {
    createApplicationDataServiceStub = sinon.stub(applicationDataService, 'createApplication');
    createAppDirectoryFilerStub = sinon.stub(filer, 'createDirectory');
    sinon.stub(applicationDataService, 'getAppCountByUrlBeginning');
    sinon.stub(commonServices.theme, 'getDefaultThemeId');
    copyFileFiler = sinon.stub(filer, 'copyFile');
    sinon.stub(appManager,'uploadApplicationData');
    createDefaultParameterGroupStub = sinon.stub(commonServices.parameter, 'createDefaultParameterGroup');
    updateApplicationDataServiceStub = sinon.stub(applicationDataService, 'updateApplication');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return the insert id properly to application services and also the argument checking for DataServices(without folderData)', async () => {
    createApplicationDataServiceStub = createApplicationDataServiceStub.returns(mockData.result.createApplication);
    const result = await applicationService.createApplication(mockData.appObject[0], mockData.userObject);
    expect(createApplicationDataServiceStub.getCall(0).args[0].login).to.have.all.keys(mockData.properties.createApplication[1]);
    expect(createApplicationDataServiceStub.getCall(0).args[0]).to.have.all.keys(mockData.properties.createApplication[0]);
    expect(result).to.deep.equal({ id: mockData.result.createApplication.insertedId });
    expect(copyFileFiler.calledOnce).to.be.false;
  });

  it.skip('should return the insert id properly to application services and also the argument checking for DataServices(with folderData)', async () => {
    createApplicationDataServiceStub = createApplicationDataServiceStub.returns(mockData.result.createApplication);
    const result = await applicationService.createApplication(mockData.appObject[1], mockData.userObject);
    expect(createApplicationDataServiceStub.getCall(0).args[0].login).to.have.all.keys(mockData.properties.createApplication[1]);
    expect(createApplicationDataServiceStub.getCall(0).args[0]).to.have.all.keys(mockData.properties.createApplication[0]);
    expect(result).to.deep.equal({ id: mockData.result.createApplication.insertedId });
    expect(copyFileFiler.calledOnce).to.be.true;
  });

  it('should check whether updateApplication in dataServices is called with right argument', async () => {
    createApplicationDataServiceStub = createApplicationDataServiceStub.returns(mockData.result.createApplication);
    await applicationService.createApplication(mockData.appObject[0], mockData.userObject);
    expect(updateApplicationDataServiceStub.getCall(0).args[0]).to.equal(mockData.result.createApplication.insertedId);
    expect(updateApplicationDataServiceStub.getCall(0).args[1]).to.have.all.keys('url', 'database.databaseName');
  });

  describe('checking if error is thrown from respective function', () => {
    let error;

    beforeEach(() => {
      sinon.stub(logger, 'error');
      error = new Error('application Data Service');
    });

    it('create application from application data services', async () => {
      createApplicationDataServiceStub = createApplicationDataServiceStub.throws(error);
      try {
        await applicationService.createApplication(mockData.appObject[0], mockData.userObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('createDefaultParameterGroup from common parameter', async () => {
      createApplicationDataServiceStub = createApplicationDataServiceStub.returns(mockData.result.createApplication);
      createDefaultParameterGroupStub = createDefaultParameterGroupStub.throws(error);
      try {
        await applicationService.createApplication(mockData.appObject[0], mockData.userObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('update application from application dataservices', async () => {
      createApplicationDataServiceStub = createApplicationDataServiceStub.returns(mockData.result.createApplication);
      updateApplicationDataServiceStub = updateApplicationDataServiceStub.throws(error);
      try {
        await applicationService.createApplication(mockData.appObject[0], mockData.userObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('createAppDirectory from Filer', async () => {
      createApplicationDataServiceStub = createApplicationDataServiceStub.returns(mockData.result.createApplication);
      createAppDirectoryFilerStub = createAppDirectoryFilerStub.throws(error);
      try {
        await applicationService.createApplication(mockData.appObject[0], mockData.userObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });
});

describe('getApplication()', () => {
  let getApplicationDataServiceStub;

  beforeEach(() => {
    sinon.stub(helper, 'decryptPassword');
    getApplicationDataServiceStub = sinon.stub(applicationDataService, 'getApplication');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return all the apps sent from data service', async () => {
    getApplicationDataServiceStub = getApplicationDataServiceStub.returns(mockData.result.getApplication);
    const result = await applicationService.getApplication(mockData.paramsObject, mockData.userObject);
    expect(getApplicationDataServiceStub.calledOnce).to.be.true;
    expect(getApplicationDataServiceStub.getCall(0).args[0]).to.equal(mockData.paramsObject.appId);
    expect(result).to.equal(mockData.result.getApplication);
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Application Data Services');
    getApplicationDataServiceStub = getApplicationDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await applicationService.getApplication(mockData.paramsObject, mockData.userObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('deleteApplication', () => {
  let deleteAllApplicationDataStub;
  let stopDeploymentServiceStub;
  let deleteApplicationDatabaseStub;
  let filerPathExistStub;
  let getApplicationDataStub;

  beforeEach(() => {
    stopDeploymentServiceStub = sinon.stub(deploymentService, 'stop');
    filerPathExistStub = sinon.stub(filer, 'pathExists');
    deleteAllApplicationDataStub = sinon.stub(applicationDataService, 'deleteAllApplicationData');
    deleteApplicationDatabaseStub = sinon.stub(applicationDataService, 'deleteApplicationDatabase');
    getApplicationDataStub = sinon.stub(applicationDataService, 'getApplicationData');
  });
  afterEach(() => {
    sinon.restore();
  });
  it('should delete the application and checking the flow (with Backup)', async () => {
    getApplicationDataStub.returns(mockData.result.getApplicationData[0]);
    const result = await applicationService.deleteApplication(mockData.paramsObject, { withBackup: 'true' }, mockData.userObject);
    expect(filerPathExistStub.calledOnce).to.be.true;
    expect(stopDeploymentServiceStub.calledOnce).to.be.true;
    expect(deleteAllApplicationDataStub.calledOnce).to.be.true;
    expect(deleteApplicationDatabaseStub.calledOnce).to.be.true;
    expect(result).to.equal(undefined);
  });

  it('should not call stop server if its status is created or inactive', async () => {
    getApplicationDataStub.returns(mockData.result.getApplicationData[1]);
    const result = await applicationService.deleteApplication(mockData.paramsObject, { withBackup: 'true' }, mockData.userObject);
    expect(stopDeploymentServiceStub.calledOnce).to.be.false;
    expect(result).to.equal(undefined);
  });

  it('should delete the application and checking the deleteDirectory is called (empty query)', async () => {
    getApplicationDataStub.returns(mockData.result.getApplicationData[0]);
    const deleteDirectoryStub = sinon.stub(filer, 'deleteDirectory');
    const result = await applicationService.deleteApplication(mockData.paramsObject, { withBackup: 'false' }, mockData.userObject);
    expect(deleteDirectoryStub.calledOnce).to.be.true;
    expect(result).to.equal(undefined);
  });

  it('should delete the application and checking the deleteDirectory is called (Backup as false)', async () => {
    getApplicationDataStub.returns(mockData.result.getApplicationData[0]);
    const deleteDirectoryStub = sinon.stub(filer, 'deleteDirectory');
    const result = await applicationService.deleteApplication(mockData.paramsObject, {}, mockData.userObject);
    expect(deleteDirectoryStub.calledOnce).to.be.true;
    expect(result).to.equal(undefined);
  });

  describe('Should throw error', () => {
    let error;

    beforeEach(() => {
      error = new Error('Throw error');
      sinon.stub(logger, 'error');
      getApplicationDataStub.returns(mockData.result.getApplicationData[0]);
    });
    afterEach(() => {
      sinon.restore();
    });

    it('deleteAllApplicationData', async () => {
      deleteAllApplicationDataStub = deleteAllApplicationDataStub.throws(error);
      try {
        await applicationService.deleteApplication(mockData.paramsObject, { withBackup: 'true' }, mockData.userObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('stop - DeploymentService', async () => {
      stopDeploymentServiceStub = stopDeploymentServiceStub.throws(error);
      try {
        await applicationService.deleteApplication(mockData.paramsObject, { withBackup: 'true' }, mockData.userObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('deleteApplicationDatabase', async () => {
      deleteApplicationDatabaseStub = deleteApplicationDatabaseStub.throws(error);
      try {
        await applicationService.deleteApplication(mockData.paramsObject, { withBackup: 'true' }, mockData.userObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });
});

describe('getTags()', () => {
  let getTagsDataServiceStub;

  beforeEach(() => {
    getTagsDataServiceStub = sinon.stub(applicationDataService, 'getTags');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should retreived result from the application data service', async () => {
    getTagsDataServiceStub = getTagsDataServiceStub.returns(mockData.result.getTag);
    const result = await applicationService.getTags(mockData.paramsObject);
    expect(getTagsDataServiceStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.result.getTag);
  });

  it('should check whether getTags in applictation data service is called and checking the argument', async () => {
    getTagsDataServiceStub = getTagsDataServiceStub.returns(mockData.result.getTag);
    await applicationService.getTags(mockData.paramsObject);
    expect(getTagsDataServiceStub.getCall(0).args[0]).to.be.equal(mockData.paramsObject.appId);
  });

  it('should throw error that is thrown from data Service for get Tags', async () => {
    const error = new Error('Application Data Services');
    getTagsDataServiceStub = getTagsDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await applicationService.getTags(mockData.paramsObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getScripts', () => {
  let getScriptsDataServiceStub;

  beforeEach(() => {
    getScriptsDataServiceStub = sinon.stub(applicationDataService, 'getScripts');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should retreive the list of scripts from the application data service to application', async () => {
    getScriptsDataServiceStub = getScriptsDataServiceStub.returns(mockData.result.getScripts);
    const result = await applicationService.getScripts(mockData.paramsObject);
    expect(getScriptsDataServiceStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.result.getScripts.scripts);
    getScriptsDataServiceStub.restore();
  });

  it('should retreive null scripts from the application data service to application', async () => {
    getScriptsDataServiceStub = getScriptsDataServiceStub.returns({ scripts: null });
    const result = await applicationService.getScripts(mockData.paramsObject);
    expect(result).to.deep.equal([]);
  });

  it('should check whether getScripts in applictation data service is called and checking the argument', async () => {
    getScriptsDataServiceStub = getScriptsDataServiceStub.returns(mockData.result.getScripts);
    await applicationService.getScripts(mockData.paramsObject);
    expect(getScriptsDataServiceStub.getCall(0).args[0]).to.be.equal(mockData.paramsObject.appId);
  });

  it('should throw error that is thrown from data Service for getting scripts', async () => {
    const error = new Error('Application Data Services');
    sinon.stub(logger, 'error');
    getScriptsDataServiceStub = getScriptsDataServiceStub.throws(error);
    try {
      await applicationService.getScripts(mockData.paramsObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
    getScriptsDataServiceStub.restore();
  });
});

describe('uploadScript', () => {
  let uploadScriptsDataServiceStub;
  let copyFileFiler;

  beforeEach(() => {
    uploadScriptsDataServiceStub = sinon.stub(applicationDataService, 'addScript');
    copyFileFiler = sinon.stub(filer, 'copyFile');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should call the application data service to add the script', async () => {
    uploadScriptsDataServiceStub = uploadScriptsDataServiceStub.returns(mockData.result.updateOne);
    copyFileFiler = copyFileFiler.returns(null);
    await applicationService.uploadScript(mockData.paramsObject, mockData.fileObject);
    expect(uploadScriptsDataServiceStub.calledOnce).to.be.true;
  });
  it('should call the copy file for uploading the script', async () => {
    uploadScriptsDataServiceStub = uploadScriptsDataServiceStub.returns(mockData.result.updateOne);
    copyFileFiler = copyFileFiler.returns(null);
    await applicationService.uploadScript(mockData.paramsObject, mockData.fileObject);
    expect(copyFileFiler.calledOnce).to.be.true;
  });
  it('should call delete the file if no destination is given for the script', async () => {
    uploadScriptsDataServiceStub = uploadScriptsDataServiceStub.returns(mockData.result.updateOne);
    copyFileFiler = copyFileFiler.returns(null);
    const deleteFile = sinon.stub(filer, 'deleteFile').returns(null);
    await applicationService.uploadScript(mockData.paramsObject, mockData.fileObject);
    expect(deleteFile.calledOnce).to.be.true;
  });
  it('should add the application data service to add the script', async () => {
    uploadScriptsDataServiceStub = uploadScriptsDataServiceStub.returns(mockData.result.updateOne);
    copyFileFiler = copyFileFiler.returns(null);
    const deleteFile = sinon.stub(filer, 'deleteFile').returns(null);
    const result = await applicationService.uploadScript(mockData.paramsObject, mockData.fileObject);
    expect(result).to.deep.equal({ ok: true });
  });
  it('should throw error that is thrown from data Service for uploading scripts', async () => {
    const error = new Error('Application Data Services');
    sinon.stub(logger, 'error');
    uploadScriptsDataServiceStub = uploadScriptsDataServiceStub.throws(error);
    try {
      await applicationService.uploadScript(mockData.paramsObject, mockData.fileObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
  it('should throw error that is thrown from copy file for uploading scripts', async () => {
    const error = new Error('Filer - copyFile');
    sinon.stub(logger, 'error');
    uploadScriptsDataServiceStub = uploadScriptsDataServiceStub.returns(mockData.result.updateOne);
    copyFileFiler = copyFileFiler.throws(error);
    const uploadScript = sinon.stub(applicationService, 'uploadScript');
    try {
      await applicationService.uploadScript(mockData.paramsObject, mockData.fileObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
  it('should throw error that is thrown from delete file for uploading scripts', async () => {
    const error = new Error('Filer - deleteFile');
    sinon.stub(logger, 'error');
    uploadScriptsDataServiceStub = uploadScriptsDataServiceStub.returns(mockData.result.updateOne);
    copyFileFiler = copyFileFiler.returns(null);
    const deleteFile = sinon.stub(filer, 'deleteFile').throws(error);
    const uploadScript = sinon.stub(applicationService, 'uploadScript');
    try {
      await applicationService.uploadScript(mockData.paramsObject, mockData.fileObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('deleteScript', () => {
  let deleteScriptsDataServiceStub;
  let deleteFileFilerStub;

  beforeEach(() => {
    deleteScriptsDataServiceStub = sinon.stub(applicationDataService, 'deleteScript');
    deleteFileFilerStub = sinon.stub(filer, 'deleteFile');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should call the application data service to delete the script', async () => {
    deleteScriptsDataServiceStub.returns(mockData.result.updateOne);
    deleteFileFilerStub = deleteFileFilerStub.returns(null);
    await applicationService.deleteScript(mockData.paramsObject.appId, mockData.paramsObject.fileName);
    expect(deleteScriptsDataServiceStub.calledOnce).to.be.true;
  });

  it('should call the filer to delete the script file from application service', async () => {
    deleteScriptsDataServiceStub.returns(mockData.result.updateOne);
    deleteFileFilerStub = deleteFileFilerStub.returns(null);
    await applicationService.deleteScript(mockData.paramsObject.appId, mockData.paramsObject.fileName);
    expect(deleteFileFilerStub.calledOnce).to.be.true;
  });

  it('should retrive the result from ', async () => {
    deleteScriptsDataServiceStub.returns(mockData.result.updateOne);
    const result = await applicationService.deleteScript(mockData.paramsObject.appId, mockData.paramsObject.fileName);
    expect(result).to.deep.equal({ ok: true });
  });

  it('should throw error that is thrown from application data service for deleting scripts', async () => {
    const error = new Error('Application Data Service');
    sinon.stub(logger, 'error');
    deleteScriptsDataServiceStub.throws(error);
    deleteFileFilerStub = deleteFileFilerStub.returns(null);
    try {
      await applicationService.deleteScript(mockData.paramsObject, mockData.fileObject);
    } catch (err) {
      expect(err).to.be.equal(error);
    }
  });
  it('should throw error that is thrown from delete file for deleting scripts', async () => {
    const error = new Error('Filer - deleteFile');
    sinon.stub(logger, 'error');
    deleteScriptsDataServiceStub = deleteScriptsDataServiceStub.returns(mockData.result.updateOne);
    deleteFileFilerStub = deleteFileFilerStub.throws(error);
    const deleteScript = sinon.stub(applicationService, 'deleteScript');
    try {
      await applicationService.deleteScript(mockData.paramsObject, mockData.fileObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getActions', () => {
  let getActionsDataServiceStub;

  beforeEach(() => {
    getActionsDataServiceStub = sinon.stub(applicationDataService, 'getActions');
  });
  afterEach(() => {
    getActionsDataServiceStub.restore();
  });

  it('should call application service to get action', async () => {
    getActionsDataServiceStub = getActionsDataServiceStub.returns(mockData.result.getActions);
    const result = await applicationService.getActions(mockData.paramsObject);
    expect(result).to.equal(mockData.result.getActions);
    expect(getActionsDataServiceStub.calledOnce).to.be.true;
  });

  it('should check whether getTags in applictation data service is called and checking the argument', async () => {
    getActionsDataServiceStub = getActionsDataServiceStub.returns(mockData.result.getActions);
    await applicationService.getActions(mockData.paramsObject);
    expect(getActionsDataServiceStub.getCall(0).args[0]).to.be.equal(mockData.paramsObject.appId);
  });

  it('should throw error that is thrown from data Service for get Tags', async () => {
    const error = new Error('Application Data Services');
    getActionsDataServiceStub = getActionsDataServiceStub.throws(error);
    const errorLogger = sinon.stub(logger, 'error');
    try {
      await applicationService.getActions(mockData.paramsObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
    errorLogger.restore();
  });
});

describe('createAction', () => {
  let createActionDataServiceStub;

  beforeEach(() => {
    createActionDataServiceStub = sinon.stub(applicationDataService, 'createAction');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should call application data service  to get action', async () => {
    createActionDataServiceStub = createActionDataServiceStub.returns(mockData.result.createAction);
    const result = await applicationService.createAction(mockData.paramsObject, mockData.actionObject, mockData.userObject);
    expect(createActionDataServiceStub.calledOnce).to.be.true;
    expect(result).to.deep.equal({ id: 1 });
  });

  it('should call the application data service to create Action with right argument', async () => {
    createActionDataServiceStub = createActionDataServiceStub.returns(mockData.result.createAction);
    await applicationService.createAction(mockData.paramsObject, mockData.actionObject, mockData.userObject);
    expect(createActionDataServiceStub.getCall(0).args[0]).to.have.all.deep.keys(mockData.properties.createAction);
  });

  it('should throw error that is thrown from data Service for get Tags', async () => {
    const error = new Error('Application Data Services');
    createActionDataServiceStub = createActionDataServiceStub.throws(error);
    const errorLogger = sinon.stub(logger, 'error');
    try {
      await applicationService.createAction(mockData.paramsObject, mockData.actionObject, mockData.userObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
    errorLogger.restore();
  });
});

describe('updateAction', () => {
  let updateActionDataServiceStub;

  beforeEach(() => {
    updateActionDataServiceStub = sinon.stub(applicationDataService, 'updateAction');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should retreive from application data service to update action', async () => {
    updateActionDataServiceStub = updateActionDataServiceStub.returns(mockData.result.updateOne);
    const result = await applicationService.updateAction(mockData.paramsObject, mockData.actionObject, mockData.userObject);
    expect(updateActionDataServiceStub.calledOnce).to.be.true;
    expect(result).to.deep.equal({ ok: true });
  });

  it('should call the application data service to update Action with right argument', async () => {
    updateActionDataServiceStub = updateActionDataServiceStub.returns(mockData.result.updateOne);
    await applicationService.updateAction(mockData.paramsObject, mockData.actionObject, mockData.userObject);
    expect(updateActionDataServiceStub.getCall(0).args[0]).to.deep.equal(mockData.parameter.updateAction);
  });

  it('should throw error that is thrown from data Service for get Tags', async () => {
    const error = new Error('Application Data Services');
    updateActionDataServiceStub = updateActionDataServiceStub.throws(error);
    const errorLogger = sinon.stub(logger, 'error');
    try {
      await applicationService.updateAction(mockData.paramsObject, mockData.actionObject, mockData.userObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
    errorLogger.restore();
  });
});
