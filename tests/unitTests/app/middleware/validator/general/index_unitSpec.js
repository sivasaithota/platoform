/* eslint-disable no-unused-vars */
const sinon = require('sinon');
const validator = require('../../../../../../app/middleware/validator/global');
const generalValidator = require('../../../../../../app/middleware/validator/global/validator');
const constants = require('../../../../../../app/common/constants');
const { expect } = require('../../../../base');
const mockData = require('./mockData');

describe('validateGetCheckUnique', () => {
  let getParameterspResStatusSpy;
  let getParametersResSendSpy;
  let validateGetCheckUniqueNextStub;

  beforeEach(() => {
    validateGetCheckUniqueNextStub = sinon.stub();
    getParameterspResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getParametersResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateCheckUniqueParams - validator', () => {
    it('should return true if the collection name exists', async () => {
      const validateParameterGroupRequestParamsSpy = sinon.spy(generalValidator, 'validateCheckUniqueParams');
      await validator.validateGetCheckUnique(mockData.requestObj.validRequest, mockData.responseObj, validateGetCheckUniqueNextStub);
      expect(validateParameterGroupRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if type in request body params is a invalid type', async () => {
      await validator.validateGetCheckUnique(mockData.requestObj.inValidArgment.inValidtype, mockData.responseObj, validateGetCheckUniqueNextStub);
      expect(getParameterspResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(getParametersResSendSpy.firstCall.args).to.eql(mockData.sendError.getCheckUnique);
    });
  });
});
