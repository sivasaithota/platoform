/* eslint-disable no-unused-vars */
const sinon = require('sinon');
const { expect } = require('../../../base');
const mockData = require('./mockData');
const controllers = require('../../../../../app/controllers/application');
const applicationService = require('../../../../../app/services/application');
const constants = require('../../../../../app/common/constants');
const commonServices = require('../../../../../app/services/common');
const mongoClient = require('../../../../../app/dataServices/mongoClient');
const applicationDataService = require('../../../../../app/dataServices/application');
const logger = require('../../../../../app/common/logger');
const filer = require('../../../../../app/common/filer');
const helper = require('../../../../../app/common/helper');
const deploymentService = require('../../../../../app/services/deployment');

describe('getApplications', () => {
  let getApplicationsResStatusSpy;
  let getApplicationsResSendSpy;

  beforeEach(() => {
    getApplicationsResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getApplicationsResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the applications from mongo database and checking the flow', async () => {
    const findMongoClientStub = sinon.stub(mongoClient, 'find').returns(mockData.resultMongoClient.getApplications);
    await controllers.getApplications(mockData.parameter.getApplications, mockData.responseObj);
    expect(findMongoClientStub.calledOnce).to.be.true;
    expect(findMongoClientStub.getCall(0).args).to.deep.equal(mockData.mongoparameter.getApplications);
    expect(getApplicationsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getApplicationsResSendSpy.firstCall.args[0].result).to.deep.equal(mockData.resultMongoClient.getApplications);
  });

  it('should throw an error if mongodb send an error', async () => {
    sinon.stub(mongoClient, 'find').throws('mongo database');
    sinon.stub(logger, 'error');
    await controllers.getApplications(mockData.parameter.getApplications, mockData.responseObj);
    expect(getApplicationsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getApplicationsResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.get.error });
  });

  it('should throw error if application Service throw error', async () => {
    sinon.stub(applicationService, 'getApplications').throws('applicationService');
    sinon.stub(logger, 'error');
    await controllers.getApplications(mockData.parameter.getApplications, mockData.responseObj);
    expect(getApplicationsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getApplicationsResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.get.error });
  });
});

describe('createApplication', () => {
  let createApplicationResSendSpy;
  let createApplicationResStatusSpy;

  beforeEach(() => {
    createApplicationResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    createApplicationResSendSpy = sinon.spy(mockData.responseObj, 'send');
    sinon.stub(filer, 'createDirectory');
    sinon.stub(applicationDataService, 'getAppCountByUrlBeginning');
    sinon.stub(filer, 'copyFile');
    sinon.stub(commonServices.parameter, 'createDefaultParameterGroup');
    sinon.stub(applicationDataService, 'updateApplication');
    sinon.stub(commonServices.theme, 'getDefaultThemeId');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the applications from mongo database and checking the flow', async () => {
    const insertOneMongoClientStub = sinon.stub(mongoClient, 'insertOne').returns(mockData.resultMongoClient.createApplication);
    await controllers.createApplication(mockData.parameter.createApplication, mockData.responseObj);
    expect(insertOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(insertOneMongoClientStub.getCall(0).args[1]).to.have.all.keys(mockData.properties.createApplication);
    expect(createApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.successfulCreate);
    expect(createApplicationResSendSpy.firstCall.args[0].result).to.deep.equal({ id: mockData.resultMongoClient.createApplication.insertedId });
  });


  it('should throw an error if mongodb send an error', async () => {
    sinon.stub(mongoClient, 'insertOne').throws('mongo database');
    sinon.stub(logger, 'error');
    await controllers.createApplication(mockData.parameter.createApplication, mockData.responseObj);
    expect(createApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(createApplicationResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.create.error });
  });

  it('should throw error if application Service throw error', async () => {
    sinon.stub(applicationService, 'createApplication').throws('applicationService');
    sinon.stub(logger, 'error');
    await controllers.createApplication(mockData.parameter.createApplication, mockData.responseObj);
    expect(createApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(createApplicationResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.create.error });
  });
});

describe('getApplication', () => {
  let getApplicationResStatusSpy;
  let getApplicationResSendSpy;

  beforeEach(() => {
    getApplicationResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getApplicationResSendSpy = sinon.spy(mockData.responseObj, 'send');
    sinon.stub(helper, 'decryptPassword');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the applications from mongo database and checking the flow', async () => {
    const findOneMongoClientStub = sinon.stub(mongoClient, 'findOne').returns(mockData.resultMongoClient.getApplication);
    await controllers.getApplication(mockData.parameter.getApplication, mockData.responseObj);
    expect(findOneMongoClientStub.getCall(0).args).to.deep.equal(mockData.mongoparameter.getApplication);
    expect(getApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getApplicationResSendSpy.firstCall.args[0].result).to.deep.equal(mockData.resultMongoClient.getApplication);
  });

  it('should throw an error if mongodb send an error', async () => {
    sinon.stub(mongoClient, 'findOne').throws('mongo database');
    sinon.stub(logger, 'error');
    await controllers.getApplication(mockData.parameter.getApplication, mockData.responseObj);
    expect(getApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getApplicationResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.getDetails.error });
  });

  it('should throw error if application Service throw error', async () => {
    sinon.stub(applicationService, 'getApplication').throws('applicationService');
    sinon.stub(logger, 'error');
    await controllers.getApplication(mockData.parameter.getApplication, mockData.responseObj);
    expect(getApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getApplicationResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.getDetails.error });
  });
});

describe('deleteApplication', () => {
  let getApplicationResStatusSpy;
  let getApplicationResSendSpy;
  let deleteAllApplicationDataStub;
  let stopDeploymentServiceStub;

  beforeEach(() => {
    getApplicationResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getApplicationResSendSpy = sinon.spy(mockData.responseObj, 'send');
    sinon.stub(commonServices.application, 'getApplicationData').returns(mockData.resultMongoClient.getApplicationData);
    stopDeploymentServiceStub = sinon.stub(deploymentService, 'stop');
    sinon.stub(filer, 'pathExists');
    deleteAllApplicationDataStub = sinon.stub(applicationDataService, 'deleteAllApplicationData');
    sinon.stub(applicationDataService, 'deleteApplicationDatabase');
  });
  afterEach(() => {
    sinon.restore();
  });
  it('should delete the application and checking the flow', async () => {
    await controllers.deleteApplication(mockData.parameter.deleteApplication, mockData.responseObj);
    expect(getApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(await getApplicationResSendSpy.firstCall.args[0].result).to.deep.equal();
    expect(stopDeploymentServiceStub.calledOnce).to.be.true;
  });

  it('should throw an error if mongodb send an error', async () => {
    deleteAllApplicationDataStub.throws('mongo database');
    await controllers.deleteApplication(mockData.parameter.deleteApplication, mockData.responseObj);
    expect(getApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getApplicationResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.delete.error });
  });
});

describe('getTags', () => {
  let getTagsResStatusSpy;
  let getTagsResSendSpy;

  beforeEach(() => {
    getTagsResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getTagsResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the applications from mongo database and checking the flow', async () => {
    const findOneMongoClientStub = sinon.stub(mongoClient, 'distinct').returns(mockData.resultMongoClient.getTags);
    await controllers.getTags(mockData.parameter.getTags, mockData.responseObj);
    expect(findOneMongoClientStub.getCall(0).args).to.deep.equal(mockData.mongoparameter.getTags);
    expect(getTagsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getTagsResSendSpy.firstCall.args[0].result).to.deep.equal(mockData.resultMongoClient.getTags);
  });

  it('should throw an error if mongodb send an error', async () => {
    const findOneMongoClientStub = sinon.stub(mongoClient, 'distinct').throws('mongo database');
    sinon.stub(logger, 'error');
    await controllers.getTags(mockData.parameter.getTags, mockData.responseObj);
    expect(getTagsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getTagsResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.tags.get.error });
  });

  it('should throw error if application Service throw error', async () => {
    const getTagsServiceStub = sinon.stub(applicationService, 'getTags').throws('applicationService');
    sinon.stub(logger, 'error');
    await controllers.getTags(mockData.parameter.getTags, mockData.responseObj);
    expect(getTagsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getTagsResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.tags.get.error });
  });
});

describe('getScripts', () => {
  let getScriptsResStatusSpy;
  let getScriptsResSendSpy;

  beforeEach(() => {
    getScriptsResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getScriptsResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the applications from mongo database and checking the flow', async () => {
    const findOneMongoClientStub = sinon.stub(mongoClient, 'findOne').returns(mockData.resultMongoClient.getScripts);
    await controllers.getScripts(mockData.parameter.getScripts, mockData.responseObj);
    expect(findOneMongoClientStub.getCall(0).args).to.deep.equal(mockData.mongoparameter.getScripts);
    expect(getScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getScriptsResSendSpy.firstCall.args[0].result).to.deep.equal(mockData.resultMongoClient.getScripts.scripts);
  });

  it('should throw an error if mongodb send an error', async () => {
    const findOneMongoClientStub = sinon.stub(mongoClient, 'findOne').throws('mongo database');
    sinon.stub(logger, 'error');
    await controllers.getScripts(mockData.parameter.getScripts, mockData.responseObj);
    expect(getScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getScriptsResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.script.get.error });
  });

  it('should throw error if application Service throw error', async () => {
    const getScriptsServiceStub = sinon.stub(applicationService, 'getScripts').throws('applicationService');
    sinon.stub(logger, 'error');
    await controllers.getScripts(mockData.parameter.getScripts, mockData.responseObj);
    expect(getScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getScriptsResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.script.get.error });
  });
});

describe('getActions', () => {
  let getActionsResStatusSpy;
  let getActionsResSendSpy;

  beforeEach(() => {
    getActionsResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getActionsResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the applications from mongo database and checking the flow', async () => {
    const findOneMongoClientStub = sinon.stub(mongoClient, 'find').returns(mockData.resultMongoClient.getActions);
    await controllers.getActions(mockData.parameter.getActions, mockData.responseObj);
    expect(findOneMongoClientStub.getCall(0).args).to.deep.equal(mockData.mongoparameter.getActions);
    expect(getActionsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getActionsResSendSpy.firstCall.args[0].result).to.deep.equal(mockData.resultMongoClient.getActions);
  });

  it('should throw an error if mongodb send an error', async () => {
    const findOneMongoClientStub = sinon.stub(mongoClient, 'find').throws('mongo database');
    sinon.stub(logger, 'error');
    await controllers.getActions(mockData.parameter.getActions, mockData.responseObj);
    expect(getActionsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getActionsResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.action.get.error });
  });

  it('should throw error if application Service throw error', async () => {
    const getActionsServiceStub = sinon.stub(applicationService, 'getActions').throws('applicationService');
    sinon.stub(logger, 'error');
    await controllers.getActions(mockData.parameter.getActions, mockData.responseObj);
    expect(getActionsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getActionsResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.action.get.error });
  });
});

describe('createAction', () => {
  let createActionResStatusSpy;
  let createActionResSendSpy;

  beforeEach(() => {
    createActionResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    createActionResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the applications from mongo database and checking the flow', async () => {
    const insertOneMongoClientStub = sinon.stub(mongoClient, 'insertOne').returns(mockData.resultMongoClient.createAction);
    await controllers.createAction(mockData.parameter.createAction, mockData.responseObj);
    expect(insertOneMongoClientStub.getCall(0).args[1]).to.have.all.keys(mockData.properties.createAction);
    expect(insertOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.action)
    expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(createActionResSendSpy.firstCall.args[0].result).to.deep.equal({ id: mockData.resultMongoClient.createAction.insertedId });
  });

  it('should throw an error if mongodb send an error', async () => {
    const insertOneMongoClientStub = sinon.stub(mongoClient, 'insertOne').throws('mongo database');
    sinon.stub(logger, 'error');
    await controllers.createAction(mockData.parameter.createAction, mockData.responseObj);
    expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(createActionResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.action.create.error });
  });

  it('should throw error if application Service throw error', async () => {
    const createActionServiceStub = sinon.stub(applicationService, 'createAction').throws('applicationService');
    sinon.stub(logger, 'error');
    await controllers.createAction(mockData.parameter.createAction, mockData.responseObj);
    expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(createActionResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.action.create.error });
  });
});

describe('updateAction', () => {
  let updateActionResStatusSpy;
  let updateActionResSendSpy;

  beforeEach(() => {
    updateActionResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    updateActionResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the applications from mongo database and checking the flow', async () => {
    const updateActionMongoClientStub = sinon.stub(mongoClient, 'updateOne').returns(mockData.resultMongoClient.updateAction);
    await controllers.updateAction(mockData.parameter.updateAction, mockData.responseObj);
    expect(updateActionMongoClientStub.getCall(0).args[0]).to.deep.equals(mockData.mongoparameter.updateAction[0]);
    expect(updateActionMongoClientStub.getCall(0).args[1]).to.deep.equals(mockData.mongoparameter.updateAction[1]);
    expect(updateActionMongoClientStub.getCall(0).args[2].$set).to.have.all.keys(mockData.properties.updateAction);
    expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(updateActionResSendSpy.firstCall.args[0].result).to.deep.equal({ ok: true });
  });

  it('should throw an error if mongodb send an error', async () => {
    const updateActionMongoClientStub = sinon.stub(mongoClient, 'updateOne').throws('mongo database');
    sinon.stub(logger, 'error');
    await controllers.updateAction(mockData.parameter.updateAction, mockData.responseObj);
    expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(updateActionResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.action.update.error });
  });

  it('should throw error if application Service throw error', async () => {
    const updateActionServiceStub = sinon.stub(applicationService, 'updateAction').throws('applicationService');
    sinon.stub(logger, 'error');
    await controllers.updateAction(mockData.parameter.updateAction, mockData.responseObj);
    expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(updateActionResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.action.update.error });
  });
});

describe('updateApplication', () => {
  let updateApplicationResStatusSpy;
  let updateApplicationResSendSpy;

  beforeEach(() => {
    updateApplicationResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    updateApplicationResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the applications from mongo database and checking the flow', async () => {
    const updateApplicationMongoClientStub = sinon.stub(mongoClient, 'updateOne').returns(mockData.resultMongoClient.updateApplication);
    await controllers.updateApplication(mockData.parameter.updateApplication, mockData.responseObj);
    expect(updateApplicationMongoClientStub.getCall(0).args[0]).to.equal(mockData.mongoparameter.updateApplication[0]);
    expect(updateApplicationMongoClientStub.getCall(0).args[1]).to.deep.equals(mockData.mongoparameter.updateApplication[1]);
    expect(updateApplicationMongoClientStub.getCall(0).args[2].$set).to.have.all.keys(mockData.properties.updateApplication);
    expect(updateApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(updateApplicationResSendSpy.firstCall.args[0].result).to.deep.equal({ ok: true });
  });

  it('should throw an error if mongodb send an error', async () => {
    sinon.stub(mongoClient, 'updateOne').throws('mongo database');
    sinon.stub(logger, 'error');
    await controllers.updateApplication(mockData.parameter.updateApplication, mockData.responseObj);
    expect(updateApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(updateApplicationResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.update.error });
  });

  it('should throw error if application Service throw error', async () => {
    sinon.stub(applicationService, 'updateApplication').throws('applicationService');
    sinon.stub(logger, 'error');
    await controllers.updateApplication(mockData.parameter.updateApplication, mockData.responseObj);
    expect(updateApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(updateApplicationResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.update.error });
  });
});

describe('deleteScript', () => {
  let deleteScriptResStatusSpy;
  let deleteScriptResSendSpy;
  let deleteFileFiler;

  beforeEach(() => {
    deleteScriptResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    deleteScriptResSendSpy = sinon.spy(mockData.responseObj, 'send');
    deleteFileFiler = sinon.stub(filer, 'deleteFile');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the applications from mongo database and checking the flow', async () => {
    const deleteScriptMongoClientStub = sinon.stub(mongoClient, 'updateOne').returns(mockData.resultMongoClient.deleteScript);
    await controllers.deleteScript(mockData.parameter.deleteScript, mockData.responseObj);
    expect(deleteFileFiler.getCall(0).args).to.deep.equal(mockData.parameter.deleteScript.deleteFile);
    expect(deleteScriptMongoClientStub.getCall(0).args).to.eql(mockData.mongoparameter.deleteScript);
    expect(deleteScriptResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(deleteScriptResSendSpy.firstCall.args[0].result).to.deep.equal({ ok: true });
  });

  it('should throw an error if mongodb send an error', async () => {
    const deleteScriptMongoClientStub = sinon.stub(mongoClient, 'updateOne').throws('mongo database');
    sinon.stub(logger, 'error');
    await controllers.deleteScript(mockData.parameter.deleteScript, mockData.responseObj);
    expect(deleteScriptResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(deleteScriptResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.script.delete.error });
  });

  it('should throw error if application Service throw error', async () => {
    const deleteScriptServiceStub = sinon.stub(applicationService, 'deleteScript').throws('applicationService');
    sinon.stub(logger, 'error');
    await controllers.deleteScript(mockData.parameter.deleteScript, mockData.responseObj);
    expect(deleteScriptResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(deleteScriptResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.script.delete.error });
  });
});

describe('uploadScript', () => {
  let uploadScriptResStatusSpy;
  let uploadScriptResSendSpy;
  let copyFilefiler;

  beforeEach(() => {
    uploadScriptResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    uploadScriptResSendSpy = sinon.spy(mockData.responseObj, 'send');
    copyFilefiler = sinon.stub(filer, 'copyFile');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the applications from mongo database and checking the flow', async () => {
    const uploadScriptMongoClientStub = sinon.stub(mongoClient, 'updateOne').returns(mockData.resultMongoClient.uploadScript);
    await controllers.uploadScript(mockData.parameter.uploadScript, mockData.responseObj);
    expect(copyFilefiler.getCall(0).args).to.eql(mockData.parameter.uploadScript.copyFileFiler);
    expect(uploadScriptMongoClientStub.getCall(0).args).to.eql(mockData.mongoparameter.uploadScript);
    expect(uploadScriptResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(uploadScriptResSendSpy.firstCall.args[0].result).to.deep.equal({ ok: true });
  });

  it('should throw an error if mongodb send an error', async () => {
    const uploadScriptMongoClientStub = sinon.stub(mongoClient, 'updateOne').throws('mongo database');
    sinon.stub(logger, 'error');
    await controllers.uploadScript(mockData.parameter.uploadScript, mockData.responseObj);
    expect(uploadScriptResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(uploadScriptResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.script.upload.error });
  });

  it('should throw error if application Service throw error', async () => {
    const uploadScriptServiceStub = sinon.stub(applicationService, 'uploadScript').throws('applicationService');
    sinon.stub(logger, 'error');
    await controllers.uploadScript(mockData.parameter.uploadScript, mockData.responseObj);
    expect(uploadScriptResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(uploadScriptResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.application.script.upload.error });
  });
});
