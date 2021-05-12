/* eslint-disable no-unused-vars */
const sinon = require('sinon');
const parameterValidator = require('../../../../../../app/middleware/validator/parameter');
const applicationDataService = require('../../../../../../app/dataServices/application');
const parameterDataService = require('../../../../../../app/dataServices/parameter');
const commonValidator = require('../../../../../../app/middleware/validator/common');
const constants = require('../../../../../../app/common/constants');
const validator = require('../../../../../../app/middleware/validator/parameter/validator');
const { expect } = require('../../../../base');
const mockData = require('./mockData');
const common = require('./common');

describe('validategetParameters', () => {
  let getParameterspResStatusSpy;
  let getParametersResSendSpy;
  let validategetParametersNextStub;

  beforeEach(() => {
    validategetParametersNextStub = sinon.stub();
    getParameterspResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getParametersResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateParameterGroupRequestParams - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if required value are correct', async () => {
      const validateParameterGroupRequestParamsSpy = sinon.spy(validator, 'validateParameterGroupRequestParams');
      await parameterValidator.validateGetParameters(mockData.requestObj.validRequest.getParameters, mockData.responseObj, validategetParametersNextStub);
      expect(validateParameterGroupRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await parameterValidator.validateGetParameters(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validategetParametersNextStub);
      expect(getParameterspResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(getParametersResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.get.paramsInvalid });
      expect(getParametersResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
    });

    it('should set the status and code if request params is empty', async () => {
      await parameterValidator.validateGetParameters({}, mockData.responseObj, validategetParametersNextStub);
      expect(getParameterspResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(getParametersResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.get.paramsInvalid });
      expect(getParametersResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: '\'undefined\' is not a valid Id' });
    });
  });

  describe('validateAppExists - commonValidator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateParameterGroupRequestParams');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.applicationDataServiceResult.applicationId);
      await parameterValidator.validateGetParameters(mockData.requestObj.validRequest.getParameters, mockData.responseObj, validategetParametersNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await parameterValidator.validateGetParameters(mockData.requestObj.validRequest.getParameters, mockData.responseObj, validategetParametersNextStub);
      expect(getParameterspResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(getParametersResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.get.noAppId });
    });
  });
});

describe('validateCreateParameterGroup', () => {
  let createParameterGrouppResStatusSpy;
  let createParameterGroupResSendSpy;
  let validateCreateParameterGroupNextStub;

  beforeEach(() => {
    validateCreateParameterGroupNextStub = sinon.stub();
    createParameterGrouppResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    createParameterGroupResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateParameterGroupRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterGroupNameNotUsed');
      sinon.stub(validator, 'validateParameterGroupRequestBody');
    });

    it('should return true if required value are correct', async () => {
      const validateParameterGroupRequestParamsSpy = sinon.spy(validator, 'validateParameterGroupRequestParams');
      await parameterValidator.validateCreateParameterGroup(mockData.requestObj.validRequest.createParameterGroup, mockData.responseObj, validateCreateParameterGroupNextStub);
      expect(validateParameterGroupRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await parameterValidator.validateCreateParameterGroup(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateCreateParameterGroupNextStub);
      expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.create.paramsInvalid });
      expect(createParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
    });

    it('should set the status and code if request params is empty', async () => {
      await parameterValidator.validateCreateParameterGroup({}, mockData.responseObj, validateCreateParameterGroupNextStub);
      expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.create.paramsInvalid });
      expect(createParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${undefined}' is not a valid Id` });
    });
  });

  describe('validateAppExists - commonValidator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateParameterGroupRequestParams');
      sinon.stub(validator, 'validateParameterGroupNameNotUsed');
      sinon.stub(validator, 'validateParameterGroupRequestBody');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.applicationDataServiceResult.applicationId);
      await parameterValidator.validateCreateParameterGroup(mockData.requestObj.validRequest.createParameterGroup, mockData.responseObj, validateCreateParameterGroupNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await parameterValidator.validateCreateParameterGroup(mockData.requestObj.validRequest.createParameterGroup, mockData.responseObj, validateCreateParameterGroupNextStub);
      expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.create.noAppId });
    });
  });

  describe('validateParameterGroupRequestBody - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterGroupNameNotUsed');
      sinon.stub(validator, 'validateParameterGroupRequestParams');
    });

    it('should return true if required value are correct', async () => {
      const validateParameterGroupRequestParamsSpy = sinon.spy(validator, 'validateParameterGroupRequestBody');
      await parameterValidator.validateCreateParameterGroup(mockData.requestObj.validRequest.createParameterGroup, mockData.responseObj, validateCreateParameterGroupNextStub);
      expect(validateParameterGroupRequestParamsSpy.returnValues[0]).to.equal(undefined);
    });

    describe('should throw for invalid properties in body', () => {
      it('should set the status and code if username is invalid', async () => {
        await parameterValidator.validateCreateParameterGroup(mockData.requestObj.inValidArgment.inValidName, mockData.responseObj, validateCreateParameterGroupNextStub);
        expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.create.bodyInvalid });
        expect(createParameterGroupResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ name: 'Must be a valid non-empty text value' });
      });

      it('should set the status and code if iscollaped is invalid', async () => {
        await parameterValidator.validateCreateParameterGroup(mockData.requestObj.inValidArgment.inValidIsCollapsed, mockData.responseObj, validateCreateParameterGroupNextStub);
        expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.create.bodyInvalid });
        expect(createParameterGroupResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ isCollapsed: 'Must be a true/false boolean value' });
      });

      it('should set the status and code as badrequest if request body is empty', async () => {
        await parameterValidator.validateCreateParameterGroup({}, mockData.responseObj, validateCreateParameterGroupNextStub);
        expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.create.bodyInvalid });
        expect(createParameterGroupResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ name: 'Must be a valid non-empty text value' });
      });
    });
  });

  describe('validateParameterGroupNameNotUsed - Validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateParameterGroupRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterGroupRequestBody');
    });

    it('should return undefined if Group Name is unique', async () => {
      const validateParameterGroupNameNotUsedSpy = sinon.spy(validator, 'validateParameterGroupNameNotUsed');
      sinon.stub(parameterDataService, 'getParameterGroupAppIdByName').returns(null);
      await parameterValidator.validateCreateParameterGroup(mockData.requestObj.validRequest.createParameterGroup, mockData.responseObj, validateCreateParameterGroupNextStub);
      expect(await validateParameterGroupNameNotUsedSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if Group Name is not unique and throw error', async () => {
      sinon.stub(parameterDataService, 'getParameterGroupAppIdByName').returns(mockData.parameterDataServiceResult.appId);
      await parameterValidator.validateCreateParameterGroup(mockData.requestObj.validRequest.createParameterGroup, mockData.responseObj, validateCreateParameterGroupNextStub);
      expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.conflict);
      expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.create.noParameterGroup });
    });
  });
});

describe('validateUpdateParameterGroup', () => {
  let updateParameterGrouppResStatusSpy;
  let updateParameterGroupResSendSpy;
  let validateupdateParameterGroupNextStub;

  beforeEach(() => {
    validateupdateParameterGroupNextStub = sinon.stub();
    updateParameterGrouppResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    updateParameterGroupResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateParameterGroupRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterGroupRequestBody');
    });

    it('should return true if required value are correct', async () => {
      const validateParameterGroupRequestParamsSpy = sinon.spy(validator, 'validateParameterGroupRequestParams');
      await parameterValidator.validateUpdateParameterGroup(mockData.requestObj.validRequest.updateParmeterGroup, mockData.responseObj, validateupdateParameterGroupNextStub);
      expect(validateParameterGroupRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await parameterValidator.validateUpdateParameterGroup(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateupdateParameterGroupNextStub);
      expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.update.paramsInvalid });
      expect(updateParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
    });

    it('should set the status and code if parameter group Id is invalid', async () => {
      await parameterValidator.validateUpdateParameterGroup(mockData.requestObj.inValidArgment.inValidGroupId, mockData.responseObj, validateupdateParameterGroupNextStub);
      expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.update.paramsInvalid });
      expect(updateParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ parameterGroupId: `'${mockData.requestObj.inValidArgment.inValidGroupId.params.parameterGroupId}' is not a valid Id` });
    });
  });

  describe('validateAppExists - commonValidator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateParameterGroupRequestParams');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterGroupRequestBody');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.applicationDataServiceResult.applicationId);
      await parameterValidator.validateUpdateParameterGroup(mockData.requestObj.validRequest.updateParmeterGroup, mockData.responseObj, validateupdateParameterGroupNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await parameterValidator.validateUpdateParameterGroup(mockData.requestObj.validRequest.updateParmeterGroup, mockData.responseObj, validateupdateParameterGroupNextStub);
      expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.update.noAppId });
    });
  });

  describe('validateParameterGroupRequestBody - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterGroupRequestParams');
    });

    it('should return true if property are valid', async () => {
      const validateParameterGroupRequestParamsSpy = sinon.spy(validator, 'validateParameterGroupRequestBody');
      await parameterValidator.validateUpdateParameterGroup(mockData.requestObj.validRequest.updateParmeterGroup, mockData.responseObj, validateupdateParameterGroupNextStub);
      expect(validateParameterGroupRequestParamsSpy.returnValues[0]).to.equal(undefined);
    });

    it.skip('should throws error if object is empty and nothing to update', async () => {
      const validateParameterGroupRequestParamsSpy = sinon.spy(validator, 'validateParameterGroupRequestBody');
      await parameterValidator.validateUpdateParameterGroup({ method: 'PATCH' }, mockData.responseObj, validateupdateParameterGroupNextStub);
      expect(validateParameterGroupRequestParamsSpy.returnValues[0]).to.equal(undefined);
    });

    describe('should throw for invalid properties in body', () => {

      it('should set the status and code if username is invalid', async () => {
        await parameterValidator.validateUpdateParameterGroup(mockData.requestObj.inValidArgment.inValidName, mockData.responseObj, validateupdateParameterGroupNextStub);
        expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.update.bodyInvalid });
        expect(updateParameterGroupResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ name: 'Must be a valid non-empty text value' });
      });

      it('should set the status and code if iscollaped is invalid', async () => {
        await parameterValidator.validateUpdateParameterGroup(mockData.requestObj.inValidArgment.inValidIsCollapsed, mockData.responseObj, validateupdateParameterGroupNextStub);
        expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.update.bodyInvalid });
        expect(updateParameterGroupResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ isCollapsed: 'Must be a true/false boolean value' });
      });
    });
  });

  describe('validateParameterGroupExists - Validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateParameterGroupRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterGroupRequestBody');
    });

    it('should return undefined if Group Name is exists', async () => {
      const validateParameterGroupNameNotUsedSpy = sinon.spy(validator, 'validateParameterGroupExists');
      sinon.stub(parameterDataService, 'getParameterGroupIdById').returns(mockData.parameterDataServiceResult.parameterGroupId);
      await parameterValidator.validateUpdateParameterGroup(mockData.requestObj.validRequest.updateParmeterGroup, mockData.responseObj, validateupdateParameterGroupNextStub);
      expect(await validateParameterGroupNameNotUsedSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if Group Name does not exist and throw error', async () => {
      sinon.stub(parameterDataService, 'getParameterGroupIdById').returns(null);
      await parameterValidator.validateUpdateParameterGroup(mockData.requestObj.validRequest.updateParmeterGroup, mockData.responseObj, validateupdateParameterGroupNextStub);
      expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.update.noParameterGroup });
    });
  });
});

describe('validateMoveParameterGroup', () => {
  let moveParameterGrouppResStatusSpy;
  let moveParameterGroupResSendSpy;
  let validateMoveParameterGroupNextStub;

  beforeEach(() => {
    validateMoveParameterGroupNextStub = sinon.stub();
    moveParameterGrouppResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    moveParameterGroupResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateParameterGroupRequestParams - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateMoveParameterGroupRequestBody');
    });

    it('should return true if required value are correct', async () => {
      const validateParameterGroupRequestParamsSpy = sinon.spy(validator, 'validateParameterGroupRequestParams');
      await parameterValidator.validateMoveParameterGroup(mockData.requestObj.validRequest.moveparameterGroup, mockData.responseObj, validateMoveParameterGroupNextStub);
      expect(validateParameterGroupRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await parameterValidator.validateMoveParameterGroup(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateMoveParameterGroupNextStub);
      expect(moveParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.move.paramsInvalid });
      expect(moveParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
    });

    it('should set the status and code if parameter group Id is invalid', async () => {
      await parameterValidator.validateMoveParameterGroup(mockData.requestObj.inValidArgment.inValidGroupId, mockData.responseObj, validateMoveParameterGroupNextStub);
      expect(moveParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.move.paramsInvalid });
      expect(moveParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ parameterGroupId: `'${mockData.requestObj.inValidArgment.inValidGroupId.params.parameterGroupId}' is not a valid Id` });
    });
  });

  describe('validateAppExists - commonValidator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateParameterGroupRequestParams');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateMoveParameterGroupRequestBody');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.applicationDataServiceResult.applicationId);
      await parameterValidator.validateMoveParameterGroup(mockData.requestObj.validRequest.moveparameterGroup, mockData.responseObj, validateMoveParameterGroupNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await parameterValidator.validateMoveParameterGroup(mockData.requestObj.validRequest.moveparameterGroup, mockData.responseObj, validateMoveParameterGroupNextStub);
      expect(moveParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.move.noAppId });
    });
  });

  describe('validateParameterGroupExists - Validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateParameterGroupRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateMoveParameterGroupRequestBody');
    });

    it('should return undefined if Group Name is exists', async () => {
      const validateParameterGroupNameNotUsedSpy = sinon.spy(validator, 'validateParameterGroupExists');
      sinon.stub(parameterDataService, 'getParameterGroupIdById').returns(mockData.parameterDataServiceResult.parameterGroupId);
      await parameterValidator.validateMoveParameterGroup(mockData.requestObj.validRequest.moveparameterGroup, mockData.responseObj, validateMoveParameterGroupNextStub);
      expect(await validateParameterGroupNameNotUsedSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if Group Name does not exist and throw error', async () => {
      sinon.stub(parameterDataService, 'getParameterGroupIdById').returns(null);
      await parameterValidator.validateMoveParameterGroup(mockData.requestObj.validRequest.moveparameterGroup, mockData.responseObj, validateMoveParameterGroupNextStub);
      expect(moveParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.move.noParameterGroup });
    });
  });

  describe('validateMoveParameterGroupRequestBody - validator', () => {

    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterGroupRequestParams');
    });

    it('should return true if property are valid', async () => {
      const validateParameterGroupRequestParamsSpy = sinon.spy(validator, 'validateParameterGroupRequestBody');
      await parameterValidator.validateMoveParameterGroup(mockData.requestObj.validRequest.moveparameterGroup, mockData.responseObj, validateMoveParameterGroupNextStub);
      expect(validateParameterGroupRequestParamsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should throws error if object is empty and nothing to move', async () => {
      const validateParameterGroupRequestParamsSpy = sinon.spy(validator, 'validateParameterGroupRequestBody');
      await parameterValidator.validateMoveParameterGroup({}, mockData.responseObj, validateMoveParameterGroupNextStub);
      expect(moveParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.move.bodyInvalid });
      expect(moveParameterGroupResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ position: 'Position should be an integer value greater than zero' });
    });

    it('should set the status and code if position is invalid', async () => {
      await parameterValidator.validateMoveParameterGroup(mockData.requestObj.inValidArgment.inValidPosition, mockData.responseObj, validateMoveParameterGroupNextStub);
      expect(moveParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.move.bodyInvalid });
      expect(moveParameterGroupResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ position: 'Position should be an integer value greater than zero' });
    });
  });
});

describe('validateCreateParameter', () => {
  let createParameterGrouppResStatusSpy;
  let createParameterGroupResSendSpy;
  let validateCreateParameterNextStub;

  beforeEach(() => {
    validateCreateParameterNextStub = sinon.stub();
    createParameterGrouppResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    createParameterGroupResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateParameterRequestParams - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterRequestQuery');
      sinon.stub(validator, 'validateParameterRequestBody');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterNameNotUsed');
      sinon.stub(validator, 'validateParameterType');
    });

    it('should return true if required value are correct', async () => {
      const validateParameterRequestParamsSpy = sinon.spy(validator, 'validateParameterRequestParams');
      await parameterValidator.validateCreateParameter(mockData.requestObj.validRequest.createParameter, mockData.responseObj, validateCreateParameterNextStub);
      expect(validateParameterRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await parameterValidator.validateCreateParameter(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateCreateParameterNextStub);
      expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.create.paramsInvalid });
      expect(createParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
    });

    it('should set the status and code if paarmeter group id is invalid', async () => {
      await parameterValidator.validateCreateParameter(mockData.requestObj.inValidArgment.inValidParameterGroupId, mockData.responseObj, validateCreateParameterNextStub);
      expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.create.paramsInvalid });
      expect(createParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ parameterGroupId: `'${mockData.requestObj.inValidArgment.inValidParameterGroupId.params.parameterGroupId}' is not a valid Id` });
    });
  });

  describe('validateParameterRequestQuery - validator', () => {

    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateParameterRequestBody');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterNameNotUsed');
      sinon.stub(validator, 'validateParameterType');
    });

    it('should return true if required value are correct', async () => {
      const validateParameterRequestParamsSpy = sinon.spy(validator, 'validateParameterRequestQuery');
      await parameterValidator.validateCreateParameter(mockData.requestObj.validRequest.createParameter, mockData.responseObj, validateCreateParameterNextStub);
      expect(validateParameterRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if position is invalid', async () => {
      await parameterValidator.validateCreateParameter(mockData.requestObj.inValidArgment.inValidPosition, mockData.responseObj, validateCreateParameterNextStub);
      expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.create.queryInvalid });
      expect(createParameterGroupResSendSpy.firstCall.args[0].invalidQueryValues).to.own.include({ position: 'Position should be a non-negative integer value' });
    });
  });

  describe('validateParameterRequestBody - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateParameterRequestQuery');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterNameNotUsed');
      sinon.stub(validator, 'validateParameterType');
    });

    it('should return true if required value are correct', async () => {
      const validateParameterRequestParamsSpy = sinon.spy(validator, 'validateParameterRequestBody');
      await parameterValidator.validateCreateParameter(mockData.requestObj.validRequest.createParameter, mockData.responseObj, validateCreateParameterNextStub);
      expect(validateParameterRequestParamsSpy.returnValues[0]).to.equal(undefined);
    });
    // this should throw error is type is missing
    it.skip('should set the status and code if type is not given and isnumeric is given', async () => {
      await parameterValidator.validateCreateParameter(mockData.requestObj.inValidArgment.inValidType, mockData.responseObj, validateCreateParameterNextStub);
    });

    it('should throw error if any required property is missing(name, isRequired, tooltip, type)', async () => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 4; i++) {
        await parameterValidator.validateCreateParameter(mockData.requestObj.inValidArgment.createParameter[i], mockData.responseObj, validateCreateParameterNextStub);
        expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.create.bodyInvalid });
        expect(createParameterGroupResSendSpy.firstCall.args[0].invalidProperties).to.own.include(common.Parameter[i]);
        createParameterGrouppResStatusSpy.restore();
        createParameterGroupResSendSpy.restore();
        createParameterGrouppResStatusSpy = sinon.spy(mockData.responseObj, 'status');
        createParameterGroupResSendSpy = sinon.spy(mockData.responseObj, 'send');
      }
    });
  });
  describe('validateAppExists - commonValidator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateParameterRequestQuery');
      sinon.stub(validator, 'validateParameterRequestBody');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterNameNotUsed');
      sinon.stub(validator, 'validateParameterType');
    });
    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.applicationDataServiceResult.applicationId);
      await parameterValidator.validateCreateParameter(mockData.requestObj.validRequest.createParameter, mockData.responseObj, validateCreateParameterNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await parameterValidator.validateCreateParameter(mockData.requestObj.validRequest.createParameter, mockData.responseObj, validateCreateParameterNextStub);
      expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.create.noAppId });
    });
  });

  describe('validateParameterGroupExistsStub - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateParameterRequestQuery');
      sinon.stub(validator, 'validateParameterRequestBody');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterNameNotUsed');
      sinon.stub(validator, 'validateParameterType');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(validator, 'validateParameterGroupExists');
      sinon.stub(parameterDataService, 'getParameterGroupIdById').returns(mockData.parameterDataServiceResult.parameterGroupId);
      await parameterValidator.validateCreateParameter(mockData.requestObj.validRequest.createParameter, mockData.responseObj, validateCreateParameterNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(parameterDataService, 'getParameterGroupIdById').returns(null);
      await parameterValidator.validateCreateParameter(mockData.requestObj.validRequest.createParameter, mockData.responseObj, validateCreateParameterNextStub);
      expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.create.noParameterGroupId });
    });
  });

  describe('validateParameterNameNotUsed - Validator', () => {

    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateParameterRequestQuery');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterRequestBody');
      sinon.stub(validator, 'validateParameterType');
    });
    it('should return undefined if Name is unique', async () => {
      const validateParameterNameNotUsedSpy = sinon.spy(validator, 'validateParameterNameNotUsed');
      sinon.stub(parameterDataService, 'getParameterAppIdByNameAndGroupId').returns(null);
      await parameterValidator.validateCreateParameter(mockData.requestObj.validRequest.createParameter, mockData.responseObj, validateCreateParameterNextStub);
      expect(await validateParameterNameNotUsedSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if Group Name is not unique and throw error', async () => {
      sinon.stub(parameterDataService, 'getParameterAppIdByNameAndGroupId').returns(mockData.parameterDataServiceResult.otherId);
      await parameterValidator.validateCreateParameter(mockData.requestObj.validRequest.createParameter, mockData.responseObj, validateCreateParameterNextStub);
      expect(createParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.conflict);
      expect(createParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.create.nameExists });
    });
  });

  describe.skip('validateParameterType - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateParameterRequestBody');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterNameNotUsed');
      sinon.stub(validator, 'validateParameterRequestQuery');
    });

    it('should set the status and code if required type is valid type', async () => {
      const validateParameterRequestParamsSpy = sinon.spy(validator, 'validateParameterType');
      await parameterValidator.validateCreateParameter(mockData.requestObj.validRequest.createParameter, mockData.responseObj, validateCreateParameterNextStub);
    });
  });
});

describe('validateDeleteParameterGroup', () => {
  let deleteParameterGroupResStatusSpy;
  let deleteParameterGroupResSendSpy;
  let validateDeleteParameterGroupNextStub;

  beforeEach(() => {
    validateDeleteParameterGroupNextStub = sinon.stub();
    deleteParameterGroupResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    deleteParameterGroupResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateParameterGroupRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateDeleteParameterGroupRequestQuery');
    });

    it('should return true if required value are correct', async () => {
      const validateParameterGroupRequestParamsSpy = sinon.spy(validator, 'validateParameterGroupRequestParams');
      await parameterValidator.validateDeleteParameterGroup(mockData.requestObj.validRequest.deleteParameterGroup, mockData.responseObj, validateDeleteParameterGroupNextStub);
      expect(validateParameterGroupRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await parameterValidator.validateDeleteParameterGroup(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateDeleteParameterGroupNextStub);
      expect(deleteParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(deleteParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.delete.paramsInvalid });
      expect(deleteParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
    });

    it('should set the status and code if parameter group Id is invalid', async () => {
      await parameterValidator.validateDeleteParameterGroup(mockData.requestObj.inValidArgment.inValidGroupId, mockData.responseObj, validateDeleteParameterGroupNextStub);
      expect(deleteParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(deleteParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.delete.paramsInvalid });
      expect(deleteParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ parameterGroupId: `'${mockData.requestObj.inValidArgment.inValidGroupId.params.parameterGroupId}' is not a valid Id` });
    });
  });

  describe('validateAppExists - commonValidator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateParameterGroupRequestParams');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateDeleteParameterGroupRequestQuery');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.applicationDataServiceResult.applicationId);
      await parameterValidator.validateDeleteParameterGroup(mockData.requestObj.validRequest.deleteParameterGroup, mockData.responseObj, validateDeleteParameterGroupNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await parameterValidator.validateDeleteParameterGroup(mockData.requestObj.validRequest.deleteParameterGroup, mockData.responseObj, validateDeleteParameterGroupNextStub);
      expect(deleteParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(deleteParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.delete.noAppId });
    });
  });

  describe('validateParameterGroupExists - Validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateParameterGroupRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateDeleteParameterGroupRequestQuery');
    });

    it('should return undefined if Group Name is exists', async () => {
      const validateParameterGroupNameNotUsedSpy = sinon.spy(validator, 'validateParameterGroupExists');
      sinon.stub(parameterDataService, 'getParameterGroupIdById').returns(mockData.applicationDataServiceResult.parameterGroupId);
      await parameterValidator.validateDeleteParameterGroup(mockData.requestObj.validRequest.deleteParameterGroup, mockData.responseObj, validateDeleteParameterGroupNextStub);
      expect(await validateParameterGroupNameNotUsedSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if Group Name does not exist and throw error', async () => {
      sinon.stub(parameterDataService, 'getParameterGroupIdById').returns(null);
      await parameterValidator.validateDeleteParameterGroup(mockData.requestObj.validRequest.deleteParameterGroup, mockData.responseObj, validateDeleteParameterGroupNextStub);
      expect(deleteParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(deleteParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.delete.noParameterGroup });
    });
  });

  describe('validateDeleteParameterGroupRequestQuery - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterGroupRequestParams');
    });

    it('should return true if property are valid', async () => {
      const validateDeleteParameterGroupRequestQuerySpy = sinon.spy(validator, 'validateDeleteParameterGroupRequestQuery');
      await parameterValidator.validateDeleteParameterGroup(mockData.requestObj.validRequest.deleteParameterGroup, mockData.responseObj, validateDeleteParameterGroupNextStub);
      expect(validateDeleteParameterGroupRequestQuerySpy.returnValues[0]).to.equal(true);
    });

    it('should throws error if query object is empty', async () => {
      const validateDeleteParameterGroupRequestQuerySpy = sinon.spy(validator, 'validateDeleteParameterGroupRequestQuery');
      await parameterValidator.validateDeleteParameterGroup({}, mockData.responseObj, validateDeleteParameterGroupNextStub);
      expect(validateDeleteParameterGroupRequestQuerySpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if query object is invalid', async () => {
      await parameterValidator.validateDeleteParameterGroup(mockData.requestObj.inValidArgment.inValidParametersMovedToGroupId, mockData.responseObj, validateDeleteParameterGroupNextStub);
      expect(deleteParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(deleteParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.group.delete.queryInvalid });
      expect(deleteParameterGroupResSendSpy.firstCall.args[0].invalidQueryValues).to.own.include({ parametersMovedToGroupId: 'Should be a valid Object Id' });
    });
  });
});

describe('validateDeleteParameter', () => {
  let deleteParameterResStatusSpy;
  let deleteParameterResSendSpy;
  let validateDeleteParameterNextStub;

  beforeEach(() => {
    validateDeleteParameterNextStub = sinon.stub();
    deleteParameterResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    deleteParameterResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateRemoveParametersRequestBody - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if required value are correct', async () => {
      const validateRemoveParametersRequestBodySpy = sinon.spy(validator, 'validateRemoveParametersRequestBody');
      await parameterValidator.validateDeleteParameters(mockData.requestObj.validRequest.deleteParameter, mockData.responseObj, validateDeleteParameterNextStub);
      expect(validateRemoveParametersRequestBodySpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if parameterGroupId is not invalid format', async () => {
      await parameterValidator.validateDeleteParameters(mockData.requestObj.inValidArgment.inValidParameterMapParameterGroupId, mockData.responseObj, validateDeleteParameterNextStub);
      expect(deleteParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(deleteParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.delete.bodyInvalid });
      expect(deleteParameterResSendSpy.firstCall.args[0].invalidProperties).to.eql({ parameterMap: { parameterGroupId: 'Key must be a 24 character hexadecimal Object Id' } });
    });

    it('should set the status and code if ParameterMap is not given as object', async () => {
      await parameterValidator.validateDeleteParameters(mockData.requestObj.inValidArgment.inValidParameterMap, mockData.responseObj, validateDeleteParameterNextStub);
      expect(deleteParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(deleteParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.delete.bodyInvalid });
      expect(deleteParameterResSendSpy.firstCall.args[0].invalidProperties).to.eql({ parameterMap: 'Must be a non-empty object' });
    });

    it('should set the status and code if ParameterId is in invalid format', async () => {
      await parameterValidator.validateDeleteParameters(mockData.requestObj.inValidArgment.inValidParameterMapParameterId, mockData.responseObj, validateDeleteParameterNextStub);
      expect(deleteParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(deleteParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.delete.bodyInvalid });
      expect(deleteParameterResSendSpy.firstCall.args[0].invalidProperties).to.eql({ parameterMap: { parameterGroupId: 'Array must contain only valid 24 character hexadecimal Object Ids' } });
    });

    it('should set the status and code if ParameterIds is not in array', async () => {
      await parameterValidator.validateDeleteParameters(mockData.requestObj.inValidArgment.inValidParameterIdArray, mockData.responseObj, validateDeleteParameterNextStub);
      expect(deleteParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(deleteParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.delete.bodyInvalid });
      expect(deleteParameterResSendSpy.firstCall.args[0].invalidProperties).to.eql({ parameterMap: { parameterGroupId: 'Must be a non-empty array of Parameter Ids' } });
    });
  });
  describe('validateAppExists - commonValidator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateRemoveParametersRequestBody');
    });
    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.parameterDataServiceResult.applicationId);
      await parameterValidator.validateDeleteParameters(mockData.requestObj.validRequest.deleteParameter, mockData.responseObj, validateDeleteParameterNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await parameterValidator.validateDeleteParameters(mockData.requestObj.validRequest.deleteParameter, mockData.responseObj, validateDeleteParameterNextStub);
      expect(deleteParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(deleteParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.delete.noAppId });
    });
  });
});

describe('validateMoveParameter', () => {
  let moveParameterResStatusSpy;
  let moveParameterResSendSpy;
  let validateMoveParameterNextStub;

  beforeEach(() => {
    validateMoveParameterNextStub = sinon.stub();
    moveParameterResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    moveParameterResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateRemoveParametersRequestBody - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateParameterGroupExists');
    });

    it('should return true if required value are correct', async () => {
      const validateRemoveParametersRequestBodySpy = sinon.spy(validator, 'validateRemoveParametersRequestBody');
      await parameterValidator.validateMoveParameters(mockData.requestObj.validRequest.moveParameter, mockData.responseObj, validateMoveParameterNextStub);
      expect(validateRemoveParametersRequestBodySpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if parameterGroupId is not invalid format', async () => {
      await parameterValidator.validateMoveParameters(mockData.requestObj.inValidArgment.inValidParameterMapParameterGroupId, mockData.responseObj, validateMoveParameterNextStub);
      expect(moveParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.move.bodyInvalid });
      expect(moveParameterResSendSpy.firstCall.args[0].invalidProperties).to.eql({ parameterMap: { parameterGroupId: 'Key must be a 24 character hexadecimal Object Id' } });
    });

    it('should set the status and code if ParameterMap is not given as object', async () => {
      await parameterValidator.validateMoveParameters(mockData.requestObj.inValidArgment.inValidParameterMap, mockData.responseObj, validateMoveParameterNextStub);
      expect(moveParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.move.bodyInvalid });
      expect(moveParameterResSendSpy.firstCall.args[0].invalidProperties).to.eql({ parameterMap: 'Must be a non-empty object' });
    });

    it('should set the status and code if position is invalid', async () => {
      await parameterValidator.validateMoveParameters(mockData.requestObj.inValidArgment.invalidPosition, mockData.responseObj, validateMoveParameterNextStub);
      expect(moveParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.move.bodyInvalid });
      expect(moveParameterResSendSpy.firstCall.args[0].invalidProperties).to.eql({ position: 'Position should be an integer value greater than zero' });
    });

    it('should set the status and code if ParameterId is in invalid format', async () => {
      await parameterValidator.validateMoveParameters(mockData.requestObj.inValidArgment.inValidParameterMapParameterId, mockData.responseObj, validateMoveParameterNextStub);
      expect(moveParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.move.bodyInvalid });
      expect(moveParameterResSendSpy.firstCall.args[0].invalidProperties).to.eql({ parameterMap: { parameterGroupId: 'Array must contain only valid 24 character hexadecimal Object Ids' } });
    });

    it('should set the status and code if ParameterIds is not in array', async () => {
      await parameterValidator.validateMoveParameters(mockData.requestObj.inValidArgment.inValidParameterIdArray, mockData.responseObj, validateMoveParameterNextStub);
      expect(moveParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.move.bodyInvalid });
      expect(moveParameterResSendSpy.firstCall.args[0].invalidProperties).to.eql({ parameterMap: { parameterGroupId: 'Must be a non-empty array of Parameter Ids' } });
    });
  });

  describe('validateAppExists - commonValidator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateRemoveParametersRequestBody');
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateParameterGroupExists');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.applicationDataServiceResult._id);
      await parameterValidator.validateMoveParameters(mockData.requestObj.validRequest.moveParameter, mockData.responseObj, validateMoveParameterNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await parameterValidator.validateMoveParameters(mockData.requestObj.validRequest.moveParameter, mockData.responseObj, validateMoveParameterNextStub);
      expect(moveParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.move.noAppId });
    });
  });

  describe('validateParameterGroupExists - Validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateRemoveParametersRequestBody');
    });

    it('should return undefined if parameter group exists by id', async () => {
      const validateParameterGroupExistsStubSpy = sinon.spy(validator, 'validateParameterGroupExists');
      sinon.stub(parameterDataService, 'getParameterGroupIdById').returns(mockData.parameterDataServiceResult.parameterGroupId);
      await parameterValidator.validateMoveParameters(mockData.requestObj.validRequest.moveParameter, mockData.responseObj, validateMoveParameterNextStub);
      expect(await validateParameterGroupExistsStubSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if parameter group does not exists and throw error', async () => {
      sinon.stub(parameterDataService, 'getParameterGroupIdById').returns(null);
      await parameterValidator.validateMoveParameters(mockData.requestObj.validRequest.moveParameter, mockData.responseObj, validateMoveParameterNextStub);
      expect(moveParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.move.noParameterGroupId });
    });
  });

  describe('validateParameterRequestParams - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateRemoveParametersRequestBody');
      sinon.stub(validator, 'validateParameterGroupExists');
    });

    it('should return true if required value are correct', async () => {
      const validateParameterRequestParamsSpy = sinon.spy(validator, 'validateParameterRequestParams');
      await parameterValidator.validateMoveParameters(mockData.requestObj.validRequest.moveParameter, mockData.responseObj, validateMoveParameterNextStub);
      expect(validateParameterRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await parameterValidator.validateMoveParameters(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateMoveParameterNextStub);
      expect(moveParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.move.paramsInvalid });
      expect(moveParameterResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
    });

    it('should set the status and code if parameterGroupId is invalid', async () => {
      await parameterValidator.validateMoveParameters(mockData.requestObj.inValidArgment.inValidParameterGroupId, mockData.responseObj, validateMoveParameterNextStub);
      expect(moveParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveParameterResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.move.paramsInvalid });
      expect(moveParameterResSendSpy.firstCall.args[0].invalidParams).to.own.include({ parameterGroupId: `'${mockData.requestObj.inValidArgment.inValidParameterGroupId.params.parameterGroupId}' is not a valid Id` });
    });
  });
});

describe('validateUpdateParameter', () => {
  let updateParameterGrouppResStatusSpy;
  let updateParameterGroupResSendSpy;
  let validateUpdateParameterNextStub;

  beforeEach(() => {
    validateUpdateParameterNextStub = sinon.stub();
    updateParameterGrouppResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    updateParameterGroupResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('validateParameterRequestParams - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterRequestBody');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterExists');
      sinon.stub(validator, 'validateParameterType');
      sinon.stub(validator, 'validateParameterRequestQuery');
    });

    it('should return true if required value are correct', async () => {
      const validateParameterRequestParamsSpy = sinon.spy(validator, 'validateParameterRequestParams');
      await parameterValidator.validateUpdateParameter(mockData.requestObj.validRequest.updateParameter, mockData.responseObj, validateUpdateParameterNextStub);
      expect(validateParameterRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await parameterValidator.validateUpdateParameter(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateUpdateParameterNextStub);
      expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.update.paramsInvalid });
      expect(updateParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
    });

    it('should set the status and code if parameterGroupId is invalid', async () => {
      await parameterValidator.validateUpdateParameter(mockData.requestObj.inValidArgment.inValidParameterGroupId, mockData.responseObj, validateUpdateParameterNextStub);
      expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.update.paramsInvalid });
      expect(updateParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ parameterGroupId: `'${mockData.requestObj.inValidArgment.inValidParameterGroupId.params.parameterGroupId}' is not a valid Id` });
    });

    it('should set the status and code if parameterId is invalid', async () => {
      await parameterValidator.validateUpdateParameter(mockData.requestObj.inValidArgment.inValidParameterId, mockData.responseObj, validateUpdateParameterNextStub);
      expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.update.paramsInvalid });
      expect(updateParameterGroupResSendSpy.firstCall.args[0].invalidParams).to.own.include({ parameterId: `'${mockData.requestObj.inValidArgment.inValidParameterId.params.parameterId}' is not a valid Id` });
    });
  });

  describe('validateParameterRequestBody - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterExists');
      sinon.stub(validator, 'validateParameterType');
      sinon.stub(validator, 'validateParameterRequestQuery');
    });

    it('should return true if required value are correct', async () => {
      const validateParameterRequestParamsSpy = sinon.spy(validator, 'validateParameterRequestBody');
      await parameterValidator.validateUpdateParameter(mockData.requestObj.validRequest.updateParameter, mockData.responseObj, validateUpdateParameterNextStub);
    });

    it('should throw error if any required property is missing(name, isRequired, tooltip, type)', async () => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 4; i++) {
        await parameterValidator.validateUpdateParameter(mockData.requestObj.inValidArgment.updateParameter[i], mockData.responseObj, validateUpdateParameterNextStub);
        expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.update.bodyInvalid });
        expect(updateParameterGroupResSendSpy.firstCall.args[0].invalidProperties).to.own.include(common.Parameter[i]);
        updateParameterGrouppResStatusSpy.restore();
        updateParameterGroupResSendSpy.restore();
        updateParameterGrouppResStatusSpy = sinon.spy(mockData.responseObj, 'status');
        updateParameterGroupResSendSpy = sinon.spy(mockData.responseObj, 'send');
      }
    });
  });

  describe('validateAppExists - commonValidator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateParameterRequestBody');
      sinon.stub(validator, 'validateParameterExists');
      sinon.stub(validator, 'validateParameterType');
      sinon.stub(validator, 'validateParameterRequestQuery');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.applicationDataServiceResult.applicationId);
      await parameterValidator.validateUpdateParameter(mockData.requestObj.validRequest.updateParameter, mockData.responseObj, validateUpdateParameterNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await parameterValidator.validateUpdateParameter(mockData.requestObj.validRequest.updateParameter, mockData.responseObj, validateUpdateParameterNextStub);
      expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.update.noAppId });
    });
  });

  describe('validateParameterGroupExists - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateParameterRequestBody');
      sinon.stub(validator, 'validateParameterExists');
      sinon.stub(validator, 'validateParameterType');
      sinon.stub(validator, 'validateParameterRequestQuery');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(validator, 'validateParameterGroupExists');
      sinon.stub(parameterDataService, 'getParameterGroupIdById').returns(mockData.parameterDataServiceResult.parameterGroupId);
      await parameterValidator.validateUpdateParameter(mockData.requestObj.validRequest.updateParameter, mockData.responseObj, validateUpdateParameterNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(parameterDataService, 'getParameterGroupIdById').returns(null);
      await parameterValidator.validateUpdateParameter(mockData.requestObj.validRequest.updateParameter, mockData.responseObj, validateUpdateParameterNextStub);
      expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.update.noParameterGroupId });
    });
  });

  describe('validateParameterExists - Validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateParameterRequestBody');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterType');
      sinon.stub(validator, 'validateParameterRequestQuery');
    });
    it('should return undefined if parameterId exists', async () => {
      const validateParameterExistsSpy = sinon.spy(validator, 'validateParameterExists');
      sinon.stub(parameterDataService, 'getParameterIdByAppId').returns(mockData.parameterDataServiceResult.parameterId);
      await parameterValidator.validateUpdateParameter(mockData.requestObj.validRequest.updateParameter, mockData.responseObj, validateUpdateParameterNextStub);
      expect(await validateParameterExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if does not exist and throw error', async () => {
      sinon.stub(parameterDataService, 'getParameterIdByAppId').returns(null);
      await parameterValidator.validateUpdateParameter(mockData.requestObj.validRequest.updateParameter, mockData.responseObj, validateUpdateParameterNextStub);
      expect(updateParameterGrouppResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.own.include({ message: constants.parameter.update.parameterDoesNotExist });
    });
  });

  describe.skip('validateParameterType - validator', () => {
    beforeEach(() => {
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateParameterRequestParams');
      sinon.stub(validator, 'validateParameterRequestBody');
      sinon.stub(validator, 'validateParameterGroupExists');
      sinon.stub(validator, 'validateParameterExists');
      sinon.stub(validator, 'validateParameterRequestQuery');
    });

    it('should set the status and code if required type is valid type', async () => {
      const validateParameterRequestParamsSpy = sinon.spy(validator, 'validateParameterType');
      await parameterValidator.validateUpdateParameter(mockData.requestObj.validRequest.updateParameter, mockData.responseObj, validateUpdateParameterNextStub);
    });
  });
});
