/* eslint-disable no-unused-vars */
const sinon = require('sinon');
const tableValidator = require('../../../../../../app/middleware/validator/table');
const tableDataService = require('../../../../../../app/dataServices/table');
const applicationDataService = require('../../../../../../app/dataServices/application');
const commonValidator = require('../../../../../../app/middleware/validator/common');
const constants = require('../../../../../../app/common/constants');
const validator = require('../../../../../../app/middleware/validator/table/validator');
const { expect } = require('../../../../base');
const mockData = require('./mockData');

describe('validateGetTables', () => {
  let getTablespResStatusSpy;
  let getTablesResSendSpy;
  let validateGetTablesNextStub;

  beforeEach(() => {
    validateGetTablesNextStub = sinon.stub();
    getTablespResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getTablesResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateTableRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateGetTableRequestQuery');
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if required value are correct', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateTableRequestParams');
      await tableValidator.validateGetTables(mockData.requestObj.validRequest.getTables, mockData.responseObj, validateGetTablesNextStub);
      expect(validateTableRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateTableRequestParams');
      await tableValidator.validateGetTables(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateGetTablesNextStub);
      expect(getTablespResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(getTablesResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.get.paramsInvalid });
    });

    it('should set the status and code if tableId is invalid', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateTableRequestParams');
      await tableValidator.validateGetTables(mockData.requestObj.inValidArgment.inValidTableId, mockData.responseObj, validateGetTablesNextStub);
      expect(getTablespResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(getTablesResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.get.paramsInvalid });
    });
  });

  describe('validateAppExists - commonValidator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateGetTableRequestQuery');
      sinon.stub(validator, 'validateTableRequestParams');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.tableDataServiceResult.applicationId);
      await tableValidator.validateGetTables(mockData.requestObj.validRequest.getTables, mockData.responseObj, validateGetTablesNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await tableValidator.validateGetTables(mockData.requestObj.validRequest.getTables, mockData.responseObj, validateGetTablesNextStub);
      expect(getTablespResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(getTablesResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.get.noAppId });
    });
  });

  describe('validateGetTableRequestQuery - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if required value are correct', async () => {
      const validateTableRequestQuerySpy = sinon.spy(validator, 'validateGetTableRequestQuery');
      await tableValidator.validateGetTables(mockData.requestObj.validRequest.getTables, mockData.responseObj, validateGetTablesNextStub);
      expect(validateTableRequestQuerySpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await tableValidator.validateGetTables(mockData.requestObj.inValidArgment.inValidQueryType, mockData.responseObj, validateGetTablesNextStub);
      expect(getTablespResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(getTablesResSendSpy.firstCall.args[0].invalidQueryParams).to.own.include({ type: `'${mockData.requestObj.inValidArgment.inValidQueryType.query.type}' is not a valid table type` });
      expect(getTablesResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.get.queryInvalid });
    });
  });
});

describe('validateCreateTables', () => {
  let createTableResStatusSpy;
  let createTableResSendSpy;
  let validateCreateTableNextStub;

  beforeEach(() => {
    validateCreateTableNextStub = sinon.stub();
    createTableResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    createTableResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateTableRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestBody');
      sinon.stub(validator, 'validateTableNameNotUsed');
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if required value are correct', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateTableRequestParams');
      await tableValidator.validateCreateTable(mockData.requestObj.validRequest.createTable, mockData.responseObj, validateCreateTableNextStub);
      expect(validateTableRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await tableValidator.validateCreateTable(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateCreateTableNextStub);
      expect(createTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.create.paramsInvalid });
    });

    it('should set the status and code if tableId is invalid', async () => {
      await tableValidator.validateCreateTable(mockData.requestObj.inValidArgment.inValidTableId, mockData.responseObj, validateCreateTableNextStub);
      expect(createTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.create.paramsInvalid });
    });
  });

  describe('validateAppExists - commonValidator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(validator, 'validateTableNameNotUsed');
      sinon.stub(validator, 'validateTableRequestBody');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.tableDataServiceResult.applicationId);
      await tableValidator.validateCreateTable(mockData.requestObj.validRequest.createTable, mockData.responseObj, validateCreateTableNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await tableValidator.validateCreateTable(mockData.requestObj.validRequest.createTable, mockData.responseObj, validateCreateTableNextStub);
      expect(createTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.get.noAppId });
    });
  });

  describe('validateTableNameNotUsed - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateTableRequestBody');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(validator, 'validateTableNameNotUsed');
      sinon.stub(tableDataService, 'getTableByName').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateCreateTable(mockData.requestObj.validRequest.createTable, mockData.responseObj, validateCreateTableNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if tableId does not exists and throw error', async () => {
      sinon.stub(tableDataService, 'getTableByName').returns(mockData.tableDataServiceResult.applicationId);
      await tableValidator.validateCreateTable(mockData.requestObj.validRequest.createTable, mockData.responseObj, validateCreateTableNextStub);
      expect(createTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.conflict);
      expect(createTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.create.tableExists });
    });
  });

  describe('validateTableRequestBody - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateTableNameNotUsed');
    });

    it('should return undefined if body is proper', async () => {
      const validateAppExistsSpy = sinon.spy(validator, 'validateTableRequestBody');
      await tableValidator.validateCreateTable(mockData.requestObj.validRequest.createTable, mockData.responseObj, validateCreateTableNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    describe.skip('should throw error if required property is inValid', async () => {
      it('should set the status and code if displayName is invalid', async () => {
        await tableValidator.validateCreateTable(mockData.requestObj.inValidArgment.inValidBody.emptyBody, mockData.responseObj, validateCreateTableNextStub);
        expect(createTableResStatusSpy.firstCall.args[0]).to.equal(constants.table.create.bodyInvalid);
        expect(createTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.create.paramsInvalid });
      });
    });
  });
});

describe('validateMoveTable', () => {
  let moveTableResStatusSpy;
  let moveTableResSendSpy;
  let validateMoveTableNextStub;

  beforeEach(() => {
    validateMoveTableNextStub = sinon.stub();
    moveTableResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    moveTableResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateTableRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateMoveRequestBody');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if required value are correct', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateTableRequestParams');
      await tableValidator.validateMoveTable(mockData.requestObj.validRequest.moveTable, mockData.responseObj, validateMoveTableNextStub);
      expect(validateTableRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await tableValidator.validateMoveTable(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateMoveTableNextStub);
      expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.move.paramsInvalid });
    });

    it('should set the status and code if tableId is invalid', async () => {
      await tableValidator.validateMoveTable(mockData.requestObj.inValidArgment.inValidTableId, mockData.responseObj, validateMoveTableNextStub);
      expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.move.paramsInvalid });
    });
  });

  describe('validateAppExists - commonValidator', () => {
    
    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(validator, 'validateMoveRequestBody');
      sinon.stub(validator, 'validateTableExists');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.tableDataServiceResult.applicationId);
      await tableValidator.validateMoveTable(mockData.requestObj.validRequest.moveTable, mockData.responseObj, validateMoveTableNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await tableValidator.validateMoveTable(mockData.requestObj.validRequest.moveTable, mockData.responseObj, validateMoveTableNextStub);
      expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.move.noAppId });
    });
  });

  describe('validateTableExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(validator, 'validateMoveRequestBody');
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return undefined if table exists by name', async () => {
      const validateTableExistsSpy = sinon.spy(validator, 'validateTableExists');
      sinon.stub(tableDataService, 'getTableById').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateMoveTable(mockData.requestObj.validRequest.moveTable, mockData.responseObj, validateMoveTableNextStub);
      expect(await validateTableExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if table does not exists and throw error', async () => {
      sinon.stub(tableDataService, 'getTableById').returns(null);
      await tableValidator.validateMoveTable(mockData.requestObj.validRequest.moveTable, mockData.responseObj, validateMoveTableNextStub);
      expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.move.tableDoesNotExist });
    });
  });

  describe('validateMoveRequestBody - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateTableExists');
    });

    it('should return true if valid move request(position)', async () => {
      const validateMoveRequestBodySpy = sinon.spy(validator, 'validateMoveRequestBody');
      await tableValidator.validateMoveTable(mockData.requestObj.validRequest.moveTable, mockData.responseObj, validateMoveTableNextStub);
      expect(await validateMoveRequestBodySpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if invalid move request(position)', async () => {
      await tableValidator.validateMoveTable(mockData.requestObj.inValidArgment.inValidPosition, mockData.responseObj, validateMoveTableNextStub);
      expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.move.bodyInvalid });
    });
  });
});

describe('validateUpdateTables', () => {
  let updateTableResStatusSpy;
  let updateTableResSendSpy;
  let validateUpdateTableNextStub;

  beforeEach(() => {
    validateUpdateTableNextStub = sinon.stub();
    updateTableResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    updateTableResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateTableRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestBody');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if required value are correct', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateTableRequestParams');
      await tableValidator.validateUpdateTable(mockData.requestObj.validRequest.updateTable, mockData.responseObj, validateUpdateTableNextStub);
      expect(validateTableRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await tableValidator.validateUpdateTable(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateUpdateTableNextStub);
      expect(updateTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.update.paramsInvalid });
    });

    it('should set the status and code if tableId is invalid', async () => {
      await tableValidator.validateUpdateTable(mockData.requestObj.inValidArgment.inValidTableId, mockData.responseObj, validateUpdateTableNextStub);
      expect(updateTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.update.paramsInvalid });
    });
  });

  describe('validateAppExists - commonValidator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(validator, 'validateTableRequestBody');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.tableDataServiceResult.applicationId);
      await tableValidator.validateUpdateTable(mockData.requestObj.validRequest.updateTable, mockData.responseObj, validateUpdateTableNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await tableValidator.validateUpdateTable(mockData.requestObj.validRequest.updateTable, mockData.responseObj, validateUpdateTableNextStub);
      expect(updateTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.get.noAppId });
    });
  });

  describe('validateTableExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateTableRequestBody');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(validator, 'validateTableExists');
      sinon.stub(tableDataService, 'getTableById').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateUpdateTable(mockData.requestObj.validRequest.updateTable, mockData.responseObj, validateUpdateTableNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(tableDataService, 'getTableById').returns(null);
      await tableValidator.validateUpdateTable(mockData.requestObj.validRequest.updateTable, mockData.responseObj, validateUpdateTableNextStub);
      expect(updateTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.update.tableDoesNotExist });
    });
  });

  describe('validateTableRequestBody - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(commonValidator.application, 'validateAppExists');
      sinon.stub(validator, 'validateTableExists');
    });

    it('should return undefined if body is proper', async () => {
      const validateAppExistsSpy = sinon.spy(validator, 'validateTableRequestBody');
      await tableValidator.validateUpdateTable(mockData.requestObj.validRequest.updateTable, mockData.responseObj, validateUpdateTableNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    describe.skip('should throw error if required property is inValid', async () => {
      it('should set the status and code if displayName is invalid', async () => {
        await tableValidator.validateUpdateTable(mockData.requestObj.inValidArgment.inValidBody.emptyBody, mockData.responseObj, validateUpdateTableNextStub);
        expect(updateTableResStatusSpy.firstCall.args[0]).to.equal(constants.table.update.bodyInvalid);
        expect(updateTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.update.paramsInvalid });
      });
    });
  });
});

describe('validateDeleteTable', () => {
  let moveTableResStatusSpy;
  let moveTableResSendSpy;
  let validateDeleteTableNextStub;

  beforeEach(() => {
    validateDeleteTableNextStub = sinon.stub();
    moveTableResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    moveTableResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateTableRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateMoveRequestBody');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if required value are correct', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateTableRequestParams');
      await tableValidator.validateDeleteTable(mockData.requestObj.validRequest.deleteTable, mockData.responseObj, validateDeleteTableNextStub);
      expect(validateTableRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if app_id is invalid', async () => {
      await tableValidator.validateDeleteTable(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateDeleteTableNextStub);
      expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.delete.paramsInvalid });
    });

    it('should set the status and code if tableId is invalid', async () => {
      await tableValidator.validateDeleteTable(mockData.requestObj.inValidArgment.inValidTableId, mockData.responseObj, validateDeleteTableNextStub);
      expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.delete.paramsInvalid });
    });
  });

  describe('validateAppExists - commonValidator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(validator, 'validateMoveRequestBody');
      sinon.stub(validator, 'validateTableExists');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.tableDataServiceResult.applicationId);
      await tableValidator.validateDeleteTable(mockData.requestObj.validRequest.deleteTable, mockData.responseObj, validateDeleteTableNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await tableValidator.validateDeleteTable(mockData.requestObj.validRequest.deleteTable, mockData.responseObj, validateDeleteTableNextStub);
      expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.delete.noAppId });
    });
  });

  describe('validateTableExists - validator', () => {
    
    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(validator, 'validateMoveRequestBody');
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return undefined if table exists by id', async () => {
      const validateTableExistsSpy = sinon.spy(validator, 'validateTableExists');
      sinon.stub(tableDataService, 'getTableById').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateDeleteTable(mockData.requestObj.validRequest.deleteTable, mockData.responseObj, validateDeleteTableNextStub);
      expect(await validateTableExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if table does not exists and throw error', async () => {
      sinon.stub(tableDataService, 'getTableById').returns(null);
      await tableValidator.validateDeleteTable(mockData.requestObj.validRequest.deleteTable, mockData.responseObj, validateDeleteTableNextStub);
      expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.delete.tableDoesNotExist });
    });
  });
});

describe('validateGetColumns', () => {
  let moveTableResStatusSpy;
  let moveTableResSendSpy;
  let validateGetColumnsNextStub;

  beforeEach(() => {
    validateGetColumnsNextStub = sinon.stub();
    moveTableResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    moveTableResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateColumnRequestParams - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateMoveRequestBody');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return true if required value are correct', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateColumnRequestParams');
      await tableValidator.validateGetColumns(mockData.requestObj.validRequest.getColumns, mockData.responseObj, validateGetColumnsNextStub);
      expect(validateTableRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    describe('checking of invalid test case', () => {

      it('should set the status and code if app_id is invalid', async () => {
        await tableValidator.validateGetColumns(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateGetColumnsNextStub);
        expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(moveTableResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
        expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.get.paramsInvalid });
      });

      it('should set the status and code if tableId is invalid', async () => {
        await tableValidator.validateGetColumns(mockData.requestObj.inValidArgment.inValidTableId, mockData.responseObj, validateGetColumnsNextStub);
        expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(moveTableResSendSpy.firstCall.args[0].invalidParams).to.own.include({ tableId: `'${mockData.requestObj.inValidArgment.inValidTableId.params.tableId}' is not a valid Id` });
        expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.get.paramsInvalid });
      });
    });
  });

  describe('validateAppExists - commonValidator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(validator, 'validateMoveRequestBody');
      sinon.stub(validator, 'validateTableExists');
    });

    it('should return undefined if app exists by id', async () => {
      const validateAppExistsSpy = sinon.spy(commonValidator.application, 'validateAppExists');
      sinon.stub(applicationDataService, 'getAppById').returns(mockData.tableDataServiceResult.applicationId);
      await tableValidator.validateGetColumns(mockData.requestObj.validRequest.getColumns, mockData.responseObj, validateGetColumnsNextStub);
      expect(await validateAppExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if app_id does not exists and throw error', async () => {
      sinon.stub(applicationDataService, 'getAppById').returns(null);
      await tableValidator.validateGetColumns(mockData.requestObj.validRequest.getColumns, mockData.responseObj, validateGetColumnsNextStub);
      expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.get.noAppId });
    });
  });

  describe('validateTableExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateTableRequestParams');
      sinon.stub(validator, 'validateMoveRequestBody');
      sinon.stub(commonValidator.application, 'validateAppExists');
    });

    it('should return undefined if table exists by id', async () => {
      const validateTableExistsSpy = sinon.spy(validator, 'validateTableExists');
      sinon.stub(tableDataService, 'getTableById').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateGetColumns(mockData.requestObj.validRequest.getColumns, mockData.responseObj, validateGetColumnsNextStub);
      expect(await validateTableExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if table does not exists and throw error', async () => {
      sinon.stub(tableDataService, 'getTableById').returns(null);
      await tableValidator.validateGetColumns(mockData.requestObj.validRequest.getColumns, mockData.responseObj, validateGetColumnsNextStub);
      expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveTableResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.get.noTableId });
    });
  });
});

describe('validateMoveColumn', () => {
  let moveColumnResStatusSpy;
  let moveColumnResSendSpy;
  let validateMoveColumnNextStub;

  beforeEach(() => {
    validateMoveColumnNextStub = sinon.stub();
    moveColumnResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    moveColumnResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateColumnRequestParams - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateMoveRequestBody');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(validator, 'validateColumnExists');
    });

    it('should return true if required value are correct', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateColumnRequestParams');
      await tableValidator.validateMoveColumn(mockData.requestObj.validRequest.moveColumn, mockData.responseObj, validateMoveColumnNextStub);
      expect(validateTableRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    describe('checking of invalid test case', () => {
      it('should set the status and code if app_id is invalid', async () => {
        await tableValidator.validateMoveColumn(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateMoveColumnNextStub);
        expect(moveColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(moveColumnResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
        expect(moveColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.move.paramsInvalid });
      });

      it('should set the status and code if tableId is invalid', async () => {
        await tableValidator.validateMoveColumn(mockData.requestObj.inValidArgment.inValidTableId, mockData.responseObj, validateMoveColumnNextStub);
        expect(moveColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(moveColumnResSendSpy.firstCall.args[0].invalidParams).to.own.include({ tableId: `'${mockData.requestObj.inValidArgment.inValidTableId.params.tableId}' is not a valid Id` });
        expect(moveColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.move.paramsInvalid });
      });
    });
  });

  describe('validateTableExists - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateMoveRequestBody');
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateColumnExists');
    });

    it('should return undefined if table exists by id', async () => {
      const validateTableExistsSpy = sinon.spy(validator, 'validateTableExists');
      sinon.stub(tableDataService, 'getTableById').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateMoveColumn(mockData.requestObj.validRequest.moveColumn, mockData.responseObj, validateMoveColumnNextStub);
      expect(await validateTableExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if table does not exists and throw error', async () => {
      sinon.stub(tableDataService, 'getTableById').returns(null);
      await tableValidator.validateMoveColumn(mockData.requestObj.validRequest.moveColumn, mockData.responseObj, validateMoveColumnNextStub);
      expect(moveColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.move.noTableId });
    });
  });

  describe('validateMoveRequestBody - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateColumnExists');
    });

    it('should return true if valid move request(position)', async () => {
      const validateMoveRequestBodySpy = sinon.spy(validator, 'validateMoveRequestBody');
      await tableValidator.validateMoveColumn(mockData.requestObj.validRequest.moveColumn, mockData.responseObj, validateMoveColumnNextStub);
      expect(await validateMoveRequestBodySpy.returnValues[0]).to.equal(true);
    });

    it('should set the status and code if invalid move request(position)', async () => {
      await tableValidator.validateMoveColumn(mockData.requestObj.inValidArgment.inValidPosition, mockData.responseObj, validateMoveColumnNextStub);
      expect(moveColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(moveColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.move.bodyInvalid });
    });
  });

  describe('validateColumnExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateMoveRequestBody');
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateTableExists');
    });

    it('should return undefined if column exists by table id', async () => {
      const validateTableExistsSpy = sinon.spy(validator, 'validateColumnExists');
      sinon.stub(tableDataService, 'getColumnById').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateMoveColumn(mockData.requestObj.validRequest.moveColumn, mockData.responseObj, validateMoveColumnNextStub);
      expect(await validateTableExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if table does not exists and throw error', async () => {
      sinon.stub(tableDataService, 'getColumnById').returns(null);
      await tableValidator.validateMoveColumn(mockData.requestObj.validRequest.moveColumn, mockData.responseObj, validateMoveColumnNextStub);
      expect(moveColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(moveColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.move.columnDoesNotExist });
    });
  });
});

describe('validateDeleteColumn', () => {
  let deleteColumnResStatusSpy;
  let deleteColumnResSendSpy;
  let validateDeleteColumnNextStub;

  beforeEach(() => {
    validateDeleteColumnNextStub = sinon.stub();
    deleteColumnResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    deleteColumnResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateColumnRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(validator, 'validateColumnExists');
    });

    it('should return true if required value are correct', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateColumnRequestParams');
      await tableValidator.validateDeleteColumn(mockData.requestObj.validRequest, mockData.responseObj, validateDeleteColumnNextStub);
      expect(validateTableRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    describe('checking of invalid test case', () => {
      it('should set the status and code if app_id is invalid', async () => {
        await tableValidator.validateDeleteColumn(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateDeleteColumnNextStub);
        expect(deleteColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(deleteColumnResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
        expect(deleteColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.delete.paramsInvalid });
      });

      it('should set the status and code if tableId is invalid', async () => {
        await tableValidator.validateDeleteColumn(mockData.requestObj.inValidArgment.inValidTableId, mockData.responseObj, validateDeleteColumnNextStub);
        expect(deleteColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(deleteColumnResSendSpy.firstCall.args[0].invalidParams).to.own.include({ tableId: `'${mockData.requestObj.inValidArgment.inValidTableId.params.tableId}' is not a valid Id` });
        expect(deleteColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.delete.paramsInvalid });
      });

      it('should set the status and code if columnId is invalid', async () => {
        await tableValidator.validateDeleteColumn(mockData.requestObj.inValidArgment.invValidColumnId, mockData.responseObj, validateDeleteColumnNextStub);
        expect(deleteColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(deleteColumnResSendSpy.firstCall.args[0].invalidParams).to.own.include({ columnId: `'${mockData.requestObj.inValidArgment.invValidColumnId.params.columnId}' is not a valid Id` });
        expect(deleteColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.delete.paramsInvalid });
      });
    });
  });

  describe('validateTableExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateColumnExists');
    });

    it('should return undefined if table exists by id', async () => {
      const validateTableExistsSpy = sinon.spy(validator, 'validateTableExists');
      sinon.stub(tableDataService, 'getTableById').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateDeleteColumn(mockData.requestObj.validRequest, mockData.responseObj, validateDeleteColumnNextStub);
      expect(await validateTableExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if table does not exists and throw error', async () => {
      sinon.stub(tableDataService, 'getTableById').returns(null);
      await tableValidator.validateDeleteColumn(mockData.requestObj.validRequest, mockData.responseObj, validateDeleteColumnNextStub);
      expect(deleteColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(deleteColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.delete.noTableId });
    });
  });

  describe('validateColumnExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateTableExists');
    });

    it('should return undefined if column exists by table id', async () => {
      const validateTableExistsSpy = sinon.spy(validator, 'validateColumnExists');
      sinon.stub(tableDataService, 'getColumnById').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateDeleteColumn(mockData.requestObj.validRequest, mockData.responseObj, validateDeleteColumnNextStub);
      expect(await validateTableExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if column does not exists and throw error', async () => {
      sinon.stub(tableDataService, 'getColumnById').returns(null);
      await tableValidator.validateDeleteColumn(mockData.requestObj.validRequest, mockData.responseObj, validateDeleteColumnNextStub);
      expect(deleteColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(deleteColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.delete.columnDoesNotExist });
    });
  });
});

describe('validateUpdateColumn', () => {
  let updateColumnResStatusSpy;
  let updateColumnResSendSpy;
  let validateUpdateColumnNextStub;

  beforeEach(() => {
    validateUpdateColumnNextStub = sinon.stub();
    updateColumnResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    updateColumnResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateColumnRequestParams - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateDatatype');
      sinon.stub(validator, 'validateColumnRequestBody');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(validator, 'validateColumnExists');
    });

    it('should return true if required value are correct', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateColumnRequestParams');
      await tableValidator.validateUpdateColumn(mockData.requestObj.validRequest.updateColumn, mockData.responseObj, validateUpdateColumnNextStub);
      expect(validateTableRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    describe('checking of invalid test case', () => {
      it('should set the status and code if app_id is invalid', async () => {
        await tableValidator.validateUpdateColumn(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateUpdateColumnNextStub);
        expect(updateColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(updateColumnResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
        expect(updateColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.update.paramsInvalid });
      });

      it('should set the status and code if tableId is invalid', async () => {
        await tableValidator.validateUpdateColumn(mockData.requestObj.inValidArgment.inValidTableId, mockData.responseObj, validateUpdateColumnNextStub);
        expect(updateColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(updateColumnResSendSpy.firstCall.args[0].invalidParams).to.own.include({ tableId: `'${mockData.requestObj.inValidArgment.inValidTableId.params.tableId}' is not a valid Id` });
        expect(updateColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.update.paramsInvalid });
      });

      it('should set the status and code if columnId is invalid', async () => {
        await tableValidator.validateUpdateColumn(mockData.requestObj.inValidArgment.invValidColumnId, mockData.responseObj, validateUpdateColumnNextStub);
        expect(updateColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(updateColumnResSendSpy.firstCall.args[0].invalidParams).to.own.include({ columnId: `'${mockData.requestObj.inValidArgment.invValidColumnId.params.columnId}' is not a valid Id` });
        expect(updateColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.update.paramsInvalid });
      });
    });
  });

  describe('validateTableExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateDatatype');
      sinon.stub(validator, 'validateColumnRequestBody');
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateColumnExists');
    });

    it('should return undefined if table exists by id', async () => {
      const validateTableExistsSpy = sinon.spy(validator, 'validateTableExists');
      sinon.stub(tableDataService, 'getTableById').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateUpdateColumn(mockData.requestObj.validRequest.updateColumn, mockData.responseObj, validateUpdateColumnNextStub);
      expect(await validateTableExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if table does not exists and throw error', async () => {
      sinon.stub(tableDataService, 'getTableById').returns(null);
      await tableValidator.validateUpdateColumn(mockData.requestObj.validRequest.updateColumn, mockData.responseObj, validateUpdateColumnNextStub);
      expect(updateColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.update.noTableId });
    });
  });

  describe('validateColumnExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(validator, 'validateDatatype');
      sinon.stub(validator, 'validateColumnRequestBody');
    });

    it('should return undefined if column exists by table id', async () => {
      const validateTableExistsSpy = sinon.spy(validator, 'validateColumnExists');
      sinon.stub(tableDataService, 'getColumnById').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateUpdateColumn(mockData.requestObj.validRequest.updateColumn, mockData.responseObj, validateUpdateColumnNextStub);
      expect(await validateTableExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if table does not exists and throw error', async () => {
      sinon.stub(tableDataService, 'getColumnById').returns(null);
      await tableValidator.validateUpdateColumn(mockData.requestObj.validRequest.updateColumn, mockData.responseObj, validateUpdateColumnNextStub);
      expect(updateColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(updateColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.update.columnDoesNotExist });
    });
  });

  describe('validateDatatype - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateColumnRequestBody');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(validator, 'validateColumnExists');
    });

    it('should return undefined if required values are correct', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateDatatype');
      await tableValidator.validateUpdateColumn(mockData.requestObj.validRequest.updateColumn, mockData.responseObj, validateUpdateColumnNextStub);
      expect(await validateTableRequestParamsSpy.returnValues[0]).to.equal(undefined);
    });

    describe('checking of invalid test case', () => {
      it('should set the status and code if datatype is invalid', async () => {
        await tableValidator.validateUpdateColumn(mockData.requestObj.inValidArgment.inValidDatatype, mockData.responseObj, validateUpdateColumnNextStub);
        expect(updateColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(updateColumnResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ datatype: 'Not a valid datatype' });
        expect(updateColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.update.invalidDatatype });
      });

      it('should set the status and code if property for datatype is invalid', async () => {
        await tableValidator.validateUpdateColumn(mockData.requestObj.inValidArgment.inValidDatatypeProperty, mockData.responseObj, validateUpdateColumnNextStub);
        expect(updateColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(updateColumnResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ scale: 'Must be a non-negative integer' });
        expect(updateColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.update.invalidDatatype });
      });
    });

    it('checking if fetching of datatype is happened when no datatype is provided', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateDatatype');
      sinon.stub(tableDataService, 'getColumnById').returns(mockData.tableDataServiceResult.updateColumn);
      await tableValidator.validateUpdateColumn(mockData.requestObj.validNoDataType, mockData.responseObj, validateUpdateColumnNextStub);
      expect(await validateTableRequestParamsSpy.returnValues[0]).to.equal(undefined);
    });
  });

  describe('validateColumnRequestBody - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateDatatype');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(validator, 'validateColumnExists');
    });

    it('checking if it remove unwanted properties in resquest body', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateColumnRequestBody');
      await tableValidator.validateUpdateColumn(mockData.requestObj.inValidArgment.wholeBody, mockData.responseObj, validateUpdateColumnNextStub);
      expect(await validateTableRequestParamsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should throw error if given body has invalid properties', async () => {
      await tableValidator.validateUpdateColumn(mockData.requestObj.inValidArgment.inValidType, mockData.responseObj, validateUpdateColumnNextStub);
      expect(updateColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(updateColumnResSendSpy.firstCall.args[0]).to.have.property('invalidProperties');
      expect(updateColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.update.bodyInvalid });
    });
  });
});

describe('validateCreateColumn', () => {
  let createColumnResStatusSpy;
  let createColumnResSendSpy;
  let validateCreateColumnNextStub;

  beforeEach(() => {
    validateCreateColumnNextStub = sinon.stub();
    createColumnResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    createColumnResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('validateColumnRequestParams - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateDatatype');
      sinon.stub(validator, 'validateColumnRequestBody');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(validator, 'validateColumnNameNotUsed');
    });

    it('should return true if required value are correct', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateColumnRequestParams');
      await tableValidator.validateCreateColumn(mockData.requestObj.validRequest.createColumn, mockData.responseObj, validateCreateColumnNextStub);
      expect(validateTableRequestParamsSpy.returnValues[0]).to.equal(true);
    });

    describe('checking of invalid test case', () => {
      it('should set the status and code if app_id is invalid', async () => {
        await tableValidator.validateCreateColumn(mockData.requestObj.inValidArgment.inValidApplicationId, mockData.responseObj, validateCreateColumnNextStub);
        expect(createColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(createColumnResSendSpy.firstCall.args[0].invalidParams).to.own.include({ appId: `'${mockData.requestObj.inValidArgment.inValidApplicationId.params.appId}' is not a valid Id` });
        expect(createColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.create.paramsInvalid });
      });

      it('should set the status and code if tableId is invalid', async () => {
        await tableValidator.validateCreateColumn(mockData.requestObj.inValidArgment.inValidTableId, mockData.responseObj, validateCreateColumnNextStub);
        expect(createColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(createColumnResSendSpy.firstCall.args[0].invalidParams).to.own.include({ tableId: `'${mockData.requestObj.inValidArgment.inValidTableId.params.tableId}' is not a valid Id` });
        expect(createColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.create.paramsInvalid });
      });
    });
  });

  describe('validateTableExists - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateDatatype');
      sinon.stub(validator, 'validateColumnRequestBody');
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateColumnNameNotUsed');
    });

    it('should return undefined if table exists by id', async () => {
      const validateTableExistsSpy = sinon.spy(validator, 'validateTableExists');
      sinon.stub(tableDataService, 'getTableById').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateCreateColumn(mockData.requestObj.validRequest.createColumn, mockData.responseObj, validateCreateColumnNextStub);
      expect(await validateTableExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if table does not exists and throw error', async () => {
      sinon.stub(tableDataService, 'getTableById').returns(null);
      await tableValidator.validateCreateColumn(mockData.requestObj.validRequest.createColumn, mockData.responseObj, validateCreateColumnNextStub);
      expect(createColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.notFound);
      expect(createColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.create.noTableId });
    });
  });

  describe('validateColumnNameNotUsed - validator', () => {

    beforeEach(() => {
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(validator, 'validateDatatype');
      sinon.stub(validator, 'validateColumnRequestBody');
    });

    it('should return undefined if column name does not exists by table id', async () => {
      const validateTableExistsSpy = sinon.spy(validator, 'validateColumnNameNotUsed');
      sinon.stub(tableDataService, 'getColumnByName').returns(null);
      await tableValidator.validateCreateColumn(mockData.requestObj.validRequest.createColumn, mockData.responseObj, validateCreateColumnNextStub);
      expect(await validateTableExistsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should set the status and code if column name exists and throw error', async () => {
      sinon.stub(tableDataService, 'getColumnByName').returns(mockData.tableDataServiceResult.tableId);
      await tableValidator.validateCreateColumn(mockData.requestObj.validRequest.createColumn, mockData.responseObj, validateCreateColumnNextStub);
      expect(createColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.conflict);
      expect(createColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.create.columnExists });
    });
  });

  describe('validateDatatype - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateColumnRequestBody');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(validator, 'validateColumnNameNotUsed');
    });

    it('should return undefined if required values are correct', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateDatatype');
      await tableValidator.validateCreateColumn(mockData.requestObj.validRequest.createColumn, mockData.responseObj, validateCreateColumnNextStub);
      expect(await validateTableRequestParamsSpy.returnValues[0]).to.equal(undefined);
    });

    describe('checking of invalid test case', () => {
      it('should set the status and code if datatype is invalid', async () => {
        await tableValidator.validateCreateColumn(mockData.requestObj.inValidArgment.inValidDatatype, mockData.responseObj, validateCreateColumnNextStub);
        expect(createColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(createColumnResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ datatype: 'Not a valid datatype' });
        expect(createColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.create.invalidDatatype });
      });

      it('should set the status and code if property for datatype is invalid', async () => {
        await tableValidator.validateCreateColumn(mockData.requestObj.inValidArgment.inValidDatatypeProperty, mockData.responseObj, validateCreateColumnNextStub);
        expect(createColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
        expect(createColumnResSendSpy.firstCall.args[0].invalidProperties).to.own.include({ scale: 'Must be a non-negative integer' });
        expect(createColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.create.invalidDatatype });
      });
    });
  });

  describe('validateColumnRequestBody - validator', () => {
    beforeEach(() => {
      sinon.stub(validator, 'validateColumnRequestParams');
      sinon.stub(validator, 'validateDatatype');
      sinon.stub(validator, 'validateTableExists');
      sinon.stub(validator, 'validateColumnNameNotUsed');
    });

    it('checking if it remove unwanted properties in resquest body', async () => {
      const validateTableRequestParamsSpy = sinon.spy(validator, 'validateColumnRequestBody');
      await tableValidator.validateCreateColumn(mockData.requestObj.inValidArgment.wholeBody, mockData.responseObj, validateCreateColumnNextStub);
      expect(await validateTableRequestParamsSpy.returnValues[0]).to.equal(undefined);
    });

    it('should throw error if given body has invalid properties', async () => {
      await tableValidator.validateCreateColumn(mockData.requestObj.inValidArgment.inValidType, mockData.responseObj, validateCreateColumnNextStub);
      expect(createColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.badRequest);
      expect(createColumnResSendSpy.firstCall.args[0]).to.have.property('invalidProperties');
      expect(createColumnResSendSpy.firstCall.args[0]).to.own.include({ message: constants.table.column.create.bodyInvalid });
    });
  });
});
