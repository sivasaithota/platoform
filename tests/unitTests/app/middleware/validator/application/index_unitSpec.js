/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const applicationDataService = require('../../../../../../app/dataServices/application');
const applicationValidator = require('../../../../../../app/middleware/validator/application');
const validator = require('../../../../../../app/middleware/validator/application/validator');
const commonValidator = require('../../../../../../app/middleware/validator/common');
const constants = require('../../../../../../app/common/constants');
const mongoClient = require('../../../../../../app/dataServices/mongoClient');
const { expect } = require('../../../../base');
const mockData = require('./mockData');
const filer = require('../../../../../../app/common/filer');
const commonServices = require('../../../../../../app/services/common');


describe('validateCreateApplication()', () => {
  let createAppResStatusSpy;
  let createAppResSendSpy;
  let validateCreateAppNextStub;

  beforeEach(() => {
    validateCreateAppNextStub = sinon.stub();
    createAppResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    createAppResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should set the code and status as badrequets if request object is empty', async () => {
    await applicationValidator.validateCreateApplication({}, mockData.responseObj, validateCreateAppNextStub);
    expect(createAppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
    expect(createAppResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.create.bodyInvalid });
    expect(createAppResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ name: 'Must be of minimum length 1, and should consist of alphanumeric characters or hyphen(_)' });
  });

  describe('validateAppRequestBody - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateAppNameNotUsed');
    });

    it('should set code and status as badrequest if name is invalid by validateAppRequestBody', async () => {
      await applicationValidator.validateCreateApplication(mockData.reqObj.createApplicationInvalidName, mockData.responseObj, validateCreateAppNextStub);
      expect(createAppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(createAppResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.create.bodyInvalid });
      expect(createAppResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ name: 'Must be of minimum length 1, and should consist of alphanumeric characters or hyphen(_)' });
    });
  
    it('should return true if name is valid by validateAppRequestBody and checkind callback function', async () => {
      const validateAppRequestBodySpy = sinon.spy(validator, 'validateAppRequestBody');
      await applicationValidator.validateCreateApplication(mockData.reqObj.createApplicationValidName, mockData.responseObj, validateCreateAppNextStub);
      expect(validateAppRequestBodySpy.returnValues[0]).to.equal(true);
      expect(validateCreateAppNextStub.calledOnce).to.be.true;
    });
  });

  describe('validateAppNameNotUsed - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestBody');
    })
    it('should return undefined if name is does not exist in validateAppNameNotUsed', async () => { 
      sinon.stub(applicationDataService, 'getAppByName').returns(null);
      const validateAppNameNotUsedSpy = sinon.spy(validator, 'validateAppNameNotUsed');
      await applicationValidator.validateCreateApplication(mockData.reqObj.createApplicationValidName, mockData.responseObj, validateCreateAppNextStub);
      expect(await validateAppNameNotUsedSpy.returnValues[0]).to.equal(undefined);
    });
  
    it('should set code and status as conflict if name exist ', async () => {
      sinon.stub(applicationDataService, 'getAppByName').returns(mockData.applicationDataServiceResult.getAppByNameExists);
      await applicationValidator.validateCreateApplication(mockData.reqObj.createApplicationValidName, mockData.responseObj, validateCreateAppNextStub);
      expect(createAppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.conflict);
      expect(createAppResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.create.appExists });
    });
  });
});

describe('validateGetApplication', () => {
  let getAppResStatusSpy;
  let getAppResSendSpy;
  let validateGetAppNextStub;
  
  beforeEach(() => {
    validateGetAppNextStub = sinon.stub();
    getAppResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getAppResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should set code and status if request object is empty', async () => {
    await applicationValidator.validateGetApplication({}, mockData.responseObj, validateGetAppNextStub);
    expect(getAppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
    expect(getAppResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.getDetails.paramsInvalid });
    expect(getAppResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: '\'undefined\' is not a invalid Id' });
  });

  describe('validateAppRequestParams - validator', () => {
    it('should return true if appId is valid', async () => {
      const validateAppRequestParamsSpy = sinon.spy(validator, 'validateAppRequestParams');
      await applicationValidator.validateGetApplication(mockData.reqObj.getApplicationValid, mockData.responseObj, validateGetAppNextStub);
      expect(validateAppRequestParamsSpy.returnValues[0]).to.equal(true);
    });
  
    it('should throw error if appId is invalid', async () => {
      await applicationValidator.validateGetApplication(mockData.reqObj.getApplicationInvalid, mockData.responseObj, validateGetAppNextStub);
      expect(getAppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(getAppResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.getDetails.paramsInvalid });
      expect(getAppResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.reqObj.getApplicationInvalid.params.appId}' is not a invalid Id` });
    });
  });
  describe.skip('validateApplicationFolderData - validator', () => {

  });
});

describe('validateUpdateApplication', () => {
  let updateAppResStatusSpy;
  let updateAppResSendSpy;
  let validateUpdateAppNextStub;
  
  beforeEach(() => {
    validateUpdateAppNextStub = sinon.stub();
    updateAppResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    updateAppResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should throw error is request object is empty', async () => {
    await applicationValidator.validateUpdateApplication({}, mockData.responseObj, validateUpdateAppNextStub);
    expect(updateAppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
    expect(updateAppResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.update.paramsInvalid });
    expect(updateAppResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: '\'undefined\' is not a invalid Id' });
  });

  describe('validateAppRequestParams - validator', () => {
    it('should return true if appId is valid', async () => {
      const validateAppRequestParamsSpy = sinon.spy(validator, 'validateAppRequestParams');
      sinon.stub(validator, 'validateApplicationRequestBody');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateAppUrlNotUsed');
      await applicationValidator.validateUpdateApplication(mockData.reqObj.updateApplicationValid, mockData.responseObj, validateUpdateAppNextStub);
      expect(validateAppRequestParamsSpy.returnValues[0]).to.be.equal(true);
    });
  
    it('should throw error if appId is invalid', async () => {
      await applicationValidator.validateUpdateApplication(mockData.reqObj.updateApplicationInvalid, mockData.responseObj, validateUpdateAppNextStub);
      expect(updateAppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(updateAppResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.update.paramsInvalid });
      expect(updateAppResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.reqObj.updateApplicationInvalid.params.appId}' is not a invalid Id` });
    });
  });
//validator yet to complete
  it.skip('should return isValid is true from propertyValidator', async () => {
    sinon.stub(validator, 'validateAppRequestParams');
    await applicationValidator.validateUpdateApplication(mockData.reqObj.updateApplicationValid, mockData.responseObj, validateUpdateAppNextStub);
  });

  describe('validateAppExists - commonValidator.application', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(validator, 'validateApplicationRequestBody');
      sinon.stub(validator, 'validateScriptNotUsedInAction');
      sinon.stub(validator, 'validateAppUrlNotUsed');
    });

    it('should return undefined if app_id exists', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getApplicationData').returns(mockData.applicationDataServiceResult.applicationId);
      await applicationValidator.validateUpdateApplication(mockData.reqObj.updateApplicationValid, mockData.responseObj, validateUpdateAppNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });
  
    it('should throw error if app_id does not exist', async () => {
      sinon.stub(applicationDataService, 'getApplicationData').returns(null);
      await applicationValidator.validateUpdateApplication(mockData.reqObj.updateApplicationValid, mockData.responseObj, validateUpdateAppNextStub);
      expect(updateAppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateAppResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.update.noAppId });
    });
  });

  describe('validateAppUrlNotUsed - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(validator, 'validateApplicationRequestBody');
      sinon.stub(commonValidator.application, 'validateAppExists');
    })
    it('should return undefined if url is unique', async () => {
      const validateAppExistsSpy = sinon.spy(validator, 'validateAppUrlNotUsed');
      sinon.stub(applicationDataService, 'getAppIdByUrl').returns(null);
      await applicationValidator.validateUpdateApplication(mockData.reqObj.updateApplicationValid, mockData.responseObj, validateUpdateAppNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });
  
    it('should set code and status as conflict if URL is not unique', async () => {
      sinon.stub(applicationDataService, 'getAppIdByUrl').returns(mockData.applicationDataServiceResult.updateApplicationUrlExist);
      await applicationValidator.validateUpdateApplication(mockData.reqObj.updateApplicationValid, mockData.responseObj, validateUpdateAppNextStub);
      expect(updateAppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.conflict);
      expect(updateAppResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.update.urlUsed });
    });
  });
});

describe('validateDeleteApplication', () => {
  let DeleteApplicationResStatusSpy;
  let DeleteApplicationResSendSpy;
  let validateDeleteApplicationNextStub;
  
  beforeEach(() => {
    validateDeleteApplicationNextStub = sinon.stub();
    DeleteApplicationResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    DeleteApplicationResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should throw error is request object is empty', async () => {
    await applicationValidator.validateDeleteApplication({}, mockData.responseObj, validateDeleteApplicationNextStub);
    expect(DeleteApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
    expect(DeleteApplicationResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.delete.paramsInvalid });
    expect(DeleteApplicationResSendSpy.firstCall.args[0].invalidParams).to.include({ appId: '\'undefined\' is not a invalid Id' });
  });

  it('should call next callback function in validateDeleteApplicationApp', async () => {
    sinon.stub(validator, 'validateAppRequestParams');
    sinon.stub(commonValidator.application, 'validateAppExists');
    await applicationValidator.validateDeleteApplication({}, mockData.responseObj, validateDeleteApplicationNextStub);
    expect(validateDeleteApplicationNextStub.calledOnce).to.be.true;
    sinon.restore();
  });

  describe('validateAppRequestParams - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if appId is valid', async () => {
      const validateTagRequestParams = sinon.spy(validator, 'validateAppRequestParams');
      await applicationValidator.validateDeleteApplication(mockData.reqObj.deleteApplicationValid, mockData.responseObj, validateDeleteApplicationNextStub);
      expect(validateTagRequestParams.returnValues[0]).to.equal(true);
    });

    it('should throw error if appId is invalid', async () => {
      await applicationValidator.validateDeleteApplication(mockData.reqObj.deleteApplicationInValid, mockData.responseObj, validateDeleteApplicationNextStub);
      expect(DeleteApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(DeleteApplicationResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.delete.paramsInvalid });
      expect(DeleteApplicationResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.reqObj.deleteApplicationInValid.params.appId}' is not a invalid Id` });
    });
  });

  describe('validateAppExists - commonValidator.application', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
    });

    it('should throw error if app exists by id', async () => {
      sinon.stub(applicationDataService, 'getApplicationData').returns(null);
      await applicationValidator.validateDeleteApplication(mockData.reqObj.deleteApplicationValid, mockData.responseObj, validateDeleteApplicationNextStub);
      expect(DeleteApplicationResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(DeleteApplicationResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.delete.noAppId });
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getApplicationData').returns(mockData.applicationDataServiceResult.applicationId);
      await applicationValidator.validateDeleteApplication(mockData.reqObj.deleteApplicationValid, mockData.responseObj, validateDeleteApplicationNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });
  });
});

describe('validateGetTags', () => {
  let getTagsResStatusSpy;
  let getTagsResSendSpy;
  let validateGetTagsNextStub;
  
  beforeEach(() => {
    validateGetTagsNextStub = sinon.stub();
    getTagsResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getTagsResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should throw error is request object is empty', async () => {
    await applicationValidator.validateGetTags({}, mockData.responseObj, validateGetTagsNextStub);
    expect(getTagsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
    expect(getTagsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.tags.get.paramsInvalid });
    expect(getTagsResSendSpy.firstCall.args[0].invalidParams).to.include({ appId: '\'undefined\' is not a invalid Id' });
  });

  it('should call next callback function in validategetTagsApp', async () => {
    sinon.stub(validator, 'validateAppRequestParams');
    sinon.stub(commonValidator.application, 'validateAppExists');
    await applicationValidator.validateGetTags({}, mockData.responseObj, validateGetTagsNextStub);
    expect(validateGetTagsNextStub.calledOnce).to.be.true;
    sinon.restore();
  });

  describe('validateAppRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if appId is valid', async () => {
      const validateTagRequestParams = sinon.spy(validator, 'validateAppRequestParams');
      await applicationValidator.validateGetTags(mockData.reqObj.getTagsValid, mockData.responseObj, validateGetTagsNextStub);
      expect(validateTagRequestParams.returnValues[0]).to.equal(true);
    });

    it('should throw error if appId is invalid', async () => {
      await applicationValidator.validateGetTags(mockData.reqObj.getTagsInvalid, mockData.responseObj, validateGetTagsNextStub);
      expect(getTagsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(getTagsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.tags.get.paramsInvalid });
      expect(getTagsResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.reqObj.getTagsInvalid.params.appId}' is not a invalid Id` });
    });
  });

  describe('validateAppExists - commonValidator.application', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
    });

    it('should throw error if app exists by id', async () => {
      sinon.stub(applicationDataService, 'getApplicationData').returns(null);
      await applicationValidator.validateGetTags(mockData.reqObj.getTagsValid, mockData.responseObj, validateGetTagsNextStub);
      expect(getTagsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(getTagsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.tags.get.noAppId });
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getApplicationData').returns(mockData.applicationDataServiceResult.applicationId);
      await applicationValidator.validateGetTags(mockData.reqObj.getTagsValid, mockData.responseObj, validateGetTagsNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });
  });
});

describe('validateGetScripts', () => {
  let getScriptsResStatusSpy;
  let getScriptsResSendSpy;
  let validateGetScriptsNextStub;
  
  beforeEach(() => {
    validateGetScriptsNextStub = sinon.stub();
    getScriptsResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getScriptsResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should throw error is request object is empty', async () => {
    await applicationValidator.validateGetScripts({}, mockData.responseObj, validateGetScriptsNextStub);
    expect(getScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
    expect(getScriptsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.script.get.paramsInvalid });
    expect(getScriptsResSendSpy.firstCall.args[0].invalidParams).to.include({ appId: '\'undefined\' is not a invalid Id' });
  });

  describe('validateAppRequestParams - validator', () => {
    beforeEach( () => {
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if appId is valid and to check the callback(next) is called', async () => {
      const validateTagRequestParams = sinon.spy(validator, 'validateAppRequestParams');
      await applicationValidator.validateGetScripts(mockData.reqObj.getScriptsValid, mockData.responseObj, validateGetScriptsNextStub);
      expect(validateTagRequestParams.returnValues[0]).to.equal(true);
      expect(validateGetScriptsNextStub.calledOnce).to.be.true;
    });

    it('should throw error if appId is invalid', async () => {
      await applicationValidator.validateGetScripts(mockData.reqObj.getScriptsInvalid, mockData.responseObj, validateGetScriptsNextStub);
      expect(getScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(getScriptsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.script.get.paramsInvalid });
      expect(getScriptsResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.reqObj.getScriptsInvalid.params.appId}' is not a invalid Id` });
    });
  });

  describe('validateAppExists - commonValidator.application', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getApplicationData').returns(mockData.applicationDataServiceResult.applicationId);
      await applicationValidator.validateGetTags(mockData.reqObj.getTagsValid, mockData.responseObj, validateGetScriptsNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should throw error if app_id does not exists', async () => {
      sinon.stub(applicationDataService, 'getApplicationData').returns(null);
      await applicationValidator.validateGetTags(mockData.reqObj.getTagsValid, mockData.responseObj, validateGetScriptsNextStub);
      expect(getScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(getScriptsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.script.get.noAppId });
    });
  });
});

describe('validateUploadScripts', () => {
  let uploadScriptsResStatusSpy;
  let uploadScriptsResSendSpy;
  let validateUploadScriptsNextStub;
  
  beforeEach(() => {
    validateUploadScriptsNextStub = sinon.stub();
    uploadScriptsResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    uploadScriptsResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should throw error is request object is empty', async () => {
    await applicationValidator.validateUploadScript({}, mockData.responseObj, validateUploadScriptsNextStub);
    expect(uploadScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
    expect(uploadScriptsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.script.upload.paramsInvalid });
    expect(uploadScriptsResSendSpy.firstCall.args[0].invalidParams).to.include({ appId: '\'undefined\' is not a invalid Id' });
  });

  describe('validateAppRequestParams - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateScriptNameNotUsed');
    })
    it('should return true if appId is valid and to check the callback(next) is called', async () => {
      const validateTagRequestParams = sinon.spy(validator, 'validateAppRequestParams');
      await applicationValidator.validateUploadScript(mockData.reqObj.uploadScriptValid, mockData.responseObj, validateUploadScriptsNextStub);
      expect(validateTagRequestParams.returnValues[0]).to.equal(true);
      expect(validateUploadScriptsNextStub.calledOnce).to.be.true;
    });

    it('should set code and status as badrequest if appId is invalid', async () => {
      await applicationValidator.validateUploadScript(mockData.reqObj.uploadScriptInvalid, mockData.responseObj, validateUploadScriptsNextStub);
      expect(uploadScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(uploadScriptsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.script.upload.paramsInvalid });
      expect(uploadScriptsResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.reqObj.uploadScriptInvalid.params.appId}' is not a invalid Id` });
    });
  });

  describe('validateAppExists - commonValidator.application', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(validator, 'validateScriptNameNotUsed');
    });

    it('should return undefined if app_id exists', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getApplicationData').returns(mockData.applicationDataServiceResult.applicationId);
      await applicationValidator.validateUploadScript(mockData.reqObj.uploadScriptValid, mockData.responseObj, validateUploadScriptsNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });
  
    it('should throw error if app_id does not exist', async () => {
      sinon.stub(filer, 'deleteFile');
      sinon.stub(applicationDataService, 'getApplicationData').returns(null);
      await applicationValidator.validateUploadScript(mockData.reqObj.uploadScriptValid, mockData.responseObj, validateUploadScriptsNextStub);
      expect(uploadScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(uploadScriptsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.script.upload.noAppId });
    });
  });

  describe('validateScriptNameNotUsed -  validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return undefined if script name is unique', async () => {
      const validateScriptNameNotUsedSpy = sinon.spy(validator, 'validateScriptNameNotUsed');
      sinon.stub(applicationDataService, 'getAppIdByScriptName').returns(null);
      await applicationValidator.validateUploadScript(mockData.reqObj.uploadScriptValid, mockData.responseObj, validateUploadScriptsNextStub);
      expect(await validateScriptNameNotUsedSpy.returnValues[0]).to.equal(undefined);
    });
  
    it('should set code and status as conflict if script name is not unique', async () => {
      sinon.stub(filer, 'deleteFile');
      sinon.stub(applicationDataService, 'getAppIdByScriptName').returns(mockData.applicationDataServiceResult.applicationId);
      await applicationValidator.validateUploadScript(mockData.reqObj.uploadScriptValid, mockData.responseObj, validateUploadScriptsNextStub);
      expect(uploadScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.conflict);
      expect(uploadScriptsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.script.upload.scriptExists });
    });
  });
});

describe('validateDeleteScript', () => {
  let deleteScriptsResStatusSpy;
  let deleteScriptsResSendSpy;
  let validateDeleteScriptsNextStub;
  
  beforeEach(() => {
    validateDeleteScriptsNextStub = sinon.stub();
    deleteScriptsResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    deleteScriptsResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should throw error is request object is empty', async () => {
    await applicationValidator.validateDeleteScript({}, mockData.responseObj, validateDeleteScriptsNextStub);
    expect(deleteScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
    expect(deleteScriptsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.script.delete.paramsInvalid });
    expect(deleteScriptsResSendSpy.firstCall.args[0].invalidParams).to.include({ appId: '\'undefined\' is not a invalid Id' });
  });

  describe('validateAppRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateScriptNotUsedInAction');
    });
    it('should return true if appId is valid and to check the callback(next) is called', async () => {
      const validateTagRequestParams = sinon.spy(validator, 'validateAppRequestParams');
      await applicationValidator.validateDeleteScript(mockData.reqObj.deleteScriptValid, mockData.responseObj, validateDeleteScriptsNextStub);
      expect(validateTagRequestParams.returnValues[0]).to.equal(true);
      expect(validateDeleteScriptsNextStub.calledOnce).to.be.true;
    });
  
    it('should throw error if appId is invalid', async () => {
      await applicationValidator.validateDeleteScript(mockData.reqObj.uploadScriptInvalid, mockData.responseObj, validateDeleteScriptsNextStub);
      expect(deleteScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(deleteScriptsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.script.delete.paramsInvalid });
      expect(deleteScriptsResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.reqObj.uploadScriptInvalid.params.appId}' is not a invalid Id` });
    });
  });

  describe('validateAppExists - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(validator, 'validateScriptNotUsedInAction');
    });

    it('should return undefined if app_id exists', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getApplicationData').returns(mockData.applicationDataServiceResult.applicationId);
      await applicationValidator.validateDeleteScript(mockData.reqObj.deleteScriptValid, mockData.responseObj, validateDeleteScriptsNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });
  
    it('should throw error if app_id does not exist', async () => {
      sinon.stub(filer, 'deleteFile');
      sinon.stub(applicationDataService, 'getApplicationData').returns(null);
      await applicationValidator.validateDeleteScript(mockData.reqObj.deleteScriptValid, mockData.responseObj, validateDeleteScriptsNextStub);
      expect(deleteScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(deleteScriptsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.script.upload.noAppId });
    });
  });

  describe('validateScriptNotUsedInAction - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return undefined if script not used in action ', async () => {
      sinon.stub(applicationDataService, 'getActionAppIdByFileName').returns(mockData.applicationDataServiceResult.documentApplicationId);
      await applicationValidator.validateDeleteScript(mockData.reqObj.deleteScriptValid, mockData.responseObj, validateDeleteScriptsNextStub);
      expect(deleteScriptsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.conflict);
      expect(deleteScriptsResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.script.delete.scriptInUse });
    });
  
    it('should throw error if script used in action', async () => {
      sinon.stub(filer, 'deleteFile');
      sinon.stub(applicationDataService, 'getActionAppIdByFileName').returns(null);
      const validateScriptNameNotUsedSpy = sinon.spy(validator, 'validateScriptNotUsedInAction');
      await applicationValidator.validateDeleteScript(mockData.reqObj.deleteScriptValid, mockData.responseObj, validateDeleteScriptsNextStub);
      expect(await validateScriptNameNotUsedSpy.returnValues[0]).to.equal(undefined);
    });
  });
});

describe('validateGetActions', () => {
  let getActionResStatusSpy;
  let getActionResSendSpy;
  let validategetActionNextStub;
  
  beforeEach(() => {
    validategetActionNextStub = sinon.stub();
    getActionResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getActionResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should throw error is request object is empty', async () => {
    await applicationValidator.validateGetActions({}, mockData.responseObj, validategetActionNextStub);
    expect(getActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
    expect(getActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.get.paramsInvalid });
    expect(getActionResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: '\'undefined\' is not a invalid Id' });
  });

  describe('validateAppRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if appId is valid', async () => {
      const validateAppRequestParamsSpy = sinon.spy(validator, 'validateAppRequestParams');
      await applicationValidator.validateGetActions(mockData.reqObj.getActionValid, mockData.responseObj, validategetActionNextStub);
      expect(validateAppRequestParamsSpy.returnValues[0]).to.equal(true);
    });
  
    it('should throw error if appId is invalid', async () => {
      await applicationValidator.validateGetActions(mockData.reqObj.getActionInvalid, mockData.responseObj, validategetActionNextStub);
      expect(getActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(getActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.get.paramsInvalid });
      expect(getActionResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.reqObj.getActionInvalid.params.appId}' is not a invalid Id` });
    });
  });

  describe('validateAppExists - commonValidator.application', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
    });
    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getApplicationData').returns(mockData.applicationDataServiceResult.applicationId);
      await applicationValidator.validateGetActions(mockData.reqObj.getActionValid, mockData.responseObj, validategetActionNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });
  
    it('should throw error if app_id does not exists', async () => {
      sinon.stub(applicationDataService, 'getApplicationData').returns(null);
      await applicationValidator.validateGetActions(mockData.reqObj.getActionValid, mockData.responseObj, validategetActionNextStub);
      expect(getActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(getActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.script.get.noAppId });
    });
  });
});

describe('validateCreateAction', () => {
  let createActionResStatusSpy;
  let createActionResSendSpy;
  let validateCreateActionNextStub;
  
  beforeEach(() => {
    validateCreateActionNextStub = sinon.stub();
    createActionResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    createActionResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should throw error is request object is empty', async () => {
    await applicationValidator.validateCreateAction({}, mockData.responseObj, validateCreateActionNextStub);
    expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
    expect(createActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.paramsInvalid });
    expect(createActionResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: '\'undefined\' is not a invalid Id' });
  });

  describe('validateAppRequestParams - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateActionRequestBody');
      sinon.stub(validator, 'validateCommand');
      sinon.stub(validator, 'validateScriptExists');
    });
    it('should return true if appId is valid', async () => {
      const validateAppRequestParamsSpy = sinon.spy(validator, 'validateAppRequestParams');
      await applicationValidator.validateCreateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateCreateActionNextStub);
      expect(validateAppRequestParamsSpy.returnValues[0]).to.equal(true);
    });
  
    it('should set code and status as badrequest if appId is invalid', async () => {
      await applicationValidator.validateCreateAction(mockData.reqObj.createActionInvalid, mockData.responseObj, validateCreateActionNextStub);
      expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(createActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.paramsInvalid });
      expect(createActionResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.reqObj.createActionInvalid.params.appId}' is not a invalid Id` });
    });
  });

  describe('validateAppExists - commonValidator.application', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(validator, 'validateActionRequestBody');
      sinon.stub(validator, 'validateCommand');
      sinon.stub(validator, 'validateScriptExists');
    });
    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getApplicationData').returns(mockData.applicationDataServiceResult.applicationId);
      await applicationValidator.validateCreateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateCreateActionNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set code and status if app_id does not exists', async () => {
      sinon.stub(applicationDataService, 'getApplicationData').returns(null);
      await applicationValidator.validateCreateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateCreateActionNextStub);
      expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.noAppId });
    });
  });

  describe('validateActionRequestBody - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateCommand');
      sinon.stub(validator, 'validateScriptExists');
    });

    it('should return undefined if it is a valid body structure', async () => {
      const validateActionRequestBodySpy = sinon.spy(validator, 'validateActionRequestBody');
      await applicationValidator.validateCreateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateCreateActionNextStub);
      expect(await validateActionRequestBodySpy.returnValues[0]).to.equal(undefined);
    });
  
    it('should set code and status as badrequest if it empty body', async () => {
      await applicationValidator.validateCreateAction(mockData.reqObj.createActionInvalid, mockData.responseObj, validateCreateActionNextStub);
      expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(createActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.bodyInvalid });
      expect(createActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ fileName: 'Must be a valid non-empty text value' });
    });
  
    it('should set code and status as badrequest if it has a invalid filename', async () => {
      await applicationValidator.validateCreateAction(mockData.reqObj.validateActionRequestBody.InvalidFilename, mockData.responseObj, validateCreateActionNextStub);
      expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(createActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.bodyInvalid });
      expect(createActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ fileName: 'Must be a valid non-empty text value' });
    });
  
    it('should set code and status as badrequest if it has a invalid command in request body', async () => {
      await applicationValidator.validateCreateAction(mockData.reqObj.validateActionRequestBody.InvalidCommand, mockData.responseObj, validateCreateActionNextStub);
      expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(createActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.bodyInvalid });
      expect(createActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ command: 'Must be a valid non-empty text value' });
    });
  
    it('should set code and status as badrequest if it does not validateString in version in request body', async () => {
      await applicationValidator.validateCreateAction(mockData.reqObj.validateActionRequestBody.InvalidVersion, mockData.responseObj, validateCreateActionNextStub);
      expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(createActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.bodyInvalid });
      expect(createActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ version: 'Must be a valid non-empty text value' });
    });
  
    it('should set code and status as badrequest if it has a invalid version in request body', async () => {
      sinon.stub(mongoClient, 'findOne').returns(mockData.mongoClientResult.createAction);
      await applicationValidator.validateCreateAction(mockData.reqObj.validateActionRequestBody.InvalidVersion, mockData.responseObj, validateCreateActionNextStub);
      expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(createActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.bodyInvalid });
      expect(createActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ version: 'Must be a valid non-empty text value' });
    });
  });

  describe('validateCommand - validator', () => {
    let getCommandCommonServices;

    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateActionRequestBody');
      sinon.stub(validator, 'validateScriptExists');
      sinon.stub(commonServices.application, 'getActionData');
      getCommandCommonServices = sinon.stub(commonServices.global, 'getCommand');
    });

    it('should return true if the command and version are valid', async () => {
      getCommandCommonServices.returns({ version: 'v3' });
      sinon.stub(mongoClient, 'findOne').returns(mockData.mongoClientResult.createAction);
      const validateCommandSpy = sinon.spy(validator, 'validateCommand');
      await applicationValidator.validateCreateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateCreateActionNextStub);
      expect(await validateCommandSpy.returnValues[0]).to.equal(true);
    });
  
    it('should set code and status as badRequest if it has a invalid version in request body', async () => {
      sinon.stub(mongoClient, 'findOne').returns(mockData.mongoClientResult.createAction);
      getCommandCommonServices.returns({ version: 'v1' });
      await applicationValidator.validateCreateAction(mockData.reqObj.validateActionRequestBody.InvalidVersion, mockData.responseObj, validateCreateActionNextStub);
      expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(createActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.bodyInvalid });
      expect(createActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ version: 'Must be a valid version' });
    });
  
    it('should set code and status as badRequest when no such command exist', async () => {
      sinon.stub(mongoClient, 'findOne').returns({ collection: {} });
      await applicationValidator.validateCreateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateCreateActionNextStub);
      expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(createActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.bodyInvalid });
      expect(createActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ command: 'Must be a valid command' });
    });  
  });

  describe('validateScriptExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateActionRequestBody');
      sinon.stub(validator, 'validateCommand');
    });

    it('should return undefined if script exist', async () => {
      const validateScriptNameNotUsedSpy = sinon.spy(validator, 'validateScriptExists');
      sinon.stub(applicationDataService, 'getAppIdByScriptName').returns(mockData.applicationDataServiceResult.applicationId);
      await applicationValidator.validateCreateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateCreateActionNextStub);
      expect(await validateScriptNameNotUsedSpy.returnValues[0]).to.equal(undefined);
    });
  
    it('should set code and status as badrequest if script does not exists', async () => {
      sinon.stub(applicationDataService, 'getAppIdByScriptName').returns(null);
      await applicationValidator.validateCreateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateCreateActionNextStub);
      expect(createActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.noScript });
    });
  });
});

describe('validateUpdateAction', () => {
  let updateActionResStatusSpy;
  let updateActionResSendSpy;
  let validateupdateActionNextStub;
  
  beforeEach(() => {
    validateupdateActionNextStub = sinon.stub();
    updateActionResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    updateActionResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should set code and status as badrequest is request object is empty', async () => {
    await applicationValidator.validateUpdateAction({}, mockData.responseObj, validateupdateActionNextStub);
    expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
    expect(updateActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.update.paramsInvalid });
    expect(updateActionResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: '\'undefined\' is not a invalid Id' });
  });

  describe('validateAppRequestParams - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateActionRequestBody');
      sinon.stub(validator, 'validateCommand');
      sinon.stub(validator, 'validateScriptExists');
      sinon.stub(validator, 'validateActionExists');
    });
    it('should return true if appId is valid', async () => {
      const validateAppRequestParamsSpy = sinon.spy(validator, 'validateAppRequestParams');
      await applicationValidator.validateUpdateAction(mockData.reqObj.updateActionValid, mockData.responseObj, validateupdateActionNextStub);
      expect(validateAppRequestParamsSpy.returnValues[0]).to.equal(true);
    });
  
    it('should set code and status as badrequest if appId is invalid', async () => {
      await applicationValidator.validateUpdateAction(mockData.reqObj.updateActionInvalid, mockData.responseObj, validateupdateActionNextStub);
      expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(updateActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.update.paramsInvalid });
      expect(updateActionResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.reqObj.createActionInvalid.params.appId}' is not a invalid Id` });
    });
  });

  describe('validateAppExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(validator, 'validateActionRequestBody');
      sinon.stub(validator, 'validateCommand');
      sinon.stub(validator, 'validateScriptExists');
      sinon.stub(validator, 'validateActionExists');
    });
    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getApplicationData').returns(mockData.applicationDataServiceResult.applicationId);
      await applicationValidator.validateUpdateAction(mockData.reqObj.updateActionValid, mockData.responseObj, validateupdateActionNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set code and status as notFound if app_id does not exists', async () => {
      sinon.stub(applicationDataService, 'getApplicationData').returns(null);
      await applicationValidator.validateUpdateAction(mockData.reqObj.updateActionValid, mockData.responseObj, validateupdateActionNextStub);
      expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.noAppId });
    });
  });

  describe('validateActionRequestBody - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateCommand');
      sinon.stub(validator, 'validateScriptExists');
      sinon.stub(validator, 'validateActionExists');
    });
    it('should return undefined if it is a valid body structure', async () => {
      const validateActionRequestBodySpy = sinon.spy(validator, 'validateActionRequestBody');
      await applicationValidator.validateUpdateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateupdateActionNextStub);
      expect(await validateActionRequestBodySpy.returnValues[0]).to.equal(undefined);
    });
  
    it('should set code and status as badRequest if it empty body', async () => {
      await applicationValidator.validateUpdateAction(mockData.reqObj.createActionInvalid, mockData.responseObj, validateupdateActionNextStub);
      expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(updateActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.update.bodyInvalid });
      expect(updateActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ fileName: 'Must be a valid non-empty text value' });
    });
  
    it('should set code and status as badRequest if it has a invalid filename', async () => {
      await applicationValidator.validateUpdateAction(mockData.reqObj.validateActionRequestBody.InvalidFilename, mockData.responseObj, validateupdateActionNextStub);
      expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(updateActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.update.bodyInvalid });
      expect(updateActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ fileName: 'Must be a valid non-empty text value' });
    });
  
    it('should set code and status as badRequest if it has a invalid command in request body', async () => {
      await applicationValidator.validateUpdateAction(mockData.reqObj.validateActionRequestBody.InvalidCommand, mockData.responseObj, validateupdateActionNextStub);
      expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(updateActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.update.bodyInvalid });
      expect(updateActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ command: 'Must be a valid non-empty text value' });
    });
  
    it('should set code and status as badRequest if it does not validateString in version in request body', async () => {
      await applicationValidator.validateUpdateAction(mockData.reqObj.validateActionRequestBody.InvalidVersion, mockData.responseObj, validateupdateActionNextStub);
      expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(updateActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.update.bodyInvalid });
      expect(updateActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ version: 'Must be a valid non-empty text value' });
    });  
  });

  describe('validateCommand - validator', () => {
    let getCommandCommonServices;

    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateActionRequestBody');
      sinon.stub(validator, 'validateScriptExists');
      sinon.stub(commonServices.application, 'getActionData');
      getCommandCommonServices = sinon.stub(commonServices.global, 'getCommand');
    });

    it('should return true if the command and version are valid', async () => {
      getCommandCommonServices.returns({ version: 'v3' });
      sinon.stub(mongoClient, 'findOne').returns(mockData.mongoClientResult.createAction);
      const validateCommandSpy = sinon.spy(validator, 'validateCommand');
      await applicationValidator.validateCreateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateupdateActionNextStub);
      expect(await validateCommandSpy.returnValues[0]).to.equal(true);
    });
  
    it('should set code and status as badRequest if it has a invalid version in request body', async () => {
      sinon.stub(mongoClient, 'findOne').returns(mockData.mongoClientResult.createAction);
      getCommandCommonServices.returns({ version: 'v1' });
      await applicationValidator.validateCreateAction(mockData.reqObj.validateActionRequestBody.InvalidVersion, mockData.responseObj, validateupdateActionNextStub);
      expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(updateActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.bodyInvalid });
      expect(updateActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ version: 'Must be a valid version' });
    });
  
    it('should set code and status as badRequest when no such command exist', async () => {
      sinon.stub(mongoClient, 'findOne').returns({ collection: {} });
      await applicationValidator.validateCreateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateupdateActionNextStub);
      expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(updateActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.bodyInvalid });
      expect(updateActionResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ command: 'Must be a valid command' });
    });
  });
  
  describe('validateActionExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateActionRequestBody');
      sinon.stub(validator, 'validateScriptExists');
      sinon.stub(validator, 'validateCommand');
    });
    it('should return true if it is a action exist', async () => {
      const validateActionExistsSpy = sinon.spy(validator, 'validateActionExists');
      sinon.stub(mongoClient, 'findOne').returns(mockData.mongoClientResult.updateActionExists);
      await applicationValidator.validateUpdateAction(mockData.reqObj.updateActionExists, mockData.responseObj, validateupdateActionNextStub);
      expect(await validateActionExistsSpy.returnValues[0]).to.equal(undefined);
    });
  
    it('should set code and status as badRequest if it is a action does not exist', async () => {
      sinon.stub(mongoClient, 'findOne').returns(null);
      await applicationValidator.validateUpdateAction(mockData.reqObj.updateActionExists, mockData.responseObj, validateupdateActionNextStub);
      expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.update.noActionId });
    });  
  });

  describe('validateScriptExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateActionExists');
      sinon.stub(validator, 'validateAppRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateActionRequestBody');
      sinon.stub(validator, 'validateCommand');
    });

    it('should return undefined if script exist', async () => {
      const validateScriptNameNotUsedSpy = sinon.spy(validator, 'validateScriptExists');
      sinon.stub(applicationDataService, 'getAppIdByScriptName').returns(mockData.applicationDataServiceResult.applicationId);
      await applicationValidator.validateUpdateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateupdateActionNextStub);
      expect(await validateScriptNameNotUsedSpy.returnValues[0]).to.equal(undefined);
    });
  
    it('should set code and status as notFound if script does not exist', async () => {
      sinon.stub(applicationDataService, 'getAppIdByScriptName').returns(null);
      await applicationValidator.validateUpdateAction(mockData.reqObj.createActionValid, mockData.responseObj, validateupdateActionNextStub);
      expect(updateActionResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateActionResSendSpy.firstCall.args[0]).to.own.include({ message: constants.application.action.create.noScript });
    });
  });
});
