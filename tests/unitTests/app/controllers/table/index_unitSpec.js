const sinon = require('sinon');
const { expect } = require('../../../base');
const mockData = require('./mockData');
const controllers = require('../../../../../app/controllers/table');
const constants = require('../../../../../app/common/constants');
const mongoClient = require('../../../../../app/dataServices/mongoClient');
const logger = require('../../../../../app/common/logger');
const filer = require('../../../../../app/common/filer');

describe('getTables', () => {
  let getTablesResStatusSpy;
  let getTablesResSendSpy;
  let findMongoClientStub;

  beforeEach(() => {
    getTablesResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getTablesResSendSpy = sinon.spy(mockData.responseObj, 'send');
    findMongoClientStub = sinon.stub(mongoClient, 'find');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the tables from mongo db and checking the flow', async () => {
    findMongoClientStub = findMongoClientStub.returns(mockData.mongoClientResult.getTables);
    await controllers.getTables(mockData.requestobj.getTables, mockData.responseObj);
    expect(findMongoClientStub.getCall(0).args).to.deep.equal(mockData.mongoClientParameter.getTables);
    expect(getTablesResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getTablesResSendSpy.firstCall.args[0].result).to.deep.equal(mockData.mongoClientResult.getTables);
  });

  it('should throw error if mongo db throws error', async () => {
    sinon.stub(logger, 'error');
    const error = new Error('mongo database');
    findMongoClientStub = findMongoClientStub.throws(error);
    await controllers.getTables(mockData.requestobj.getTables, mockData.responseObj);
    expect(getTablesResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getTablesResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.get.error });
  });
});

describe('createTable', () => {
  let createTableResStatusSpy;
  let createTableResSendSpy;
  let insertOneMongoClientStub;
  let countDocumentsMongoClientStub;

  beforeEach(() => {
    createTableResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    createTableResSendSpy = sinon.spy(mockData.responseObj, 'send');
    insertOneMongoClientStub = sinon.stub(mongoClient, 'insertOne');
    countDocumentsMongoClientStub = sinon.stub(mongoClient, 'countDocuments').returns(2);
    sinon.stub(filer, 'moveFile');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('Checking the flow till mongo db for create table', () => {
    beforeEach(() => {
      insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.mongoClientResult.insertOne);
    });

    it('checking the status and code if it created the table successfully', async () => {
      await controllers.createTable(mockData.requestobj.createTable, mockData.responseObj);
      expect(createTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.successfulCreate);
      expect(createTableResSendSpy.firstCall.args[0].result.id).to.deep.equal(mockData.mongoClientResult.insertOne.insertedId);
    });

    it('checking the argument for mongo db statement', async () => {
      await controllers.createTable(mockData.requestobj.createTable, mockData.responseObj);
      expect(insertOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.table);
      expect(insertOneMongoClientStub.getCall(0).args[1]).to.have.all.keys(mockData.properties.createTable[0]);
      expect(insertOneMongoClientStub.getCall(0).args[1].columns[0]).to.have.all.keys(mockData.properties.createTable[1]);
    });
  });

  describe('Throwing error from mongo db', () => {
    let error;

    beforeEach(() => {
      sinon.stub(logger, 'error');
      error = new Error('mongo database');
    });

    it('should throw error if inserOne from mongo Db throw error', async () => {
      insertOneMongoClientStub = insertOneMongoClientStub.throws(error);
      await controllers.createTable(mockData.requestobj.createTable, mockData.responseObj);
      expect(createTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(createTableResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.create.error });
    });

    it('should throw error if countDocuments from mongo Db throw error', async () => {
      countDocumentsMongoClientStub = countDocumentsMongoClientStub.throws(error);
      await controllers.createTable(mockData.requestobj.createTable, mockData.responseObj);
      expect(createTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(createTableResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.create.error });
    });
  });
});

describe('moveTable', () => {
  let moveTableResStatusSpy;
  let moveTableResSendSpy;
  let updateOneMongoClientStub;

  beforeEach(() => {
    moveTableResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    moveTableResSendSpy = sinon.spy(mockData.responseObj, 'send');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should move the table and checking the flow', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne[0]);
    await controllers.moveTable(mockData.requestobj.moveTable, mockData.responseObj);
    expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.moveTable[0]);
    expect(updateOneMongoClientStub.getCall(1).args).to.eql(mockData.mongoClientParameter.moveTable[1]);
    expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(moveTableResSendSpy.firstCall.args[0].result).to.eql({ ok: true });
  });

  it('should throw error if mongo db throws error', async () => {
    sinon.stub(logger, 'error');
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    await controllers.moveTable(mockData.requestobj.moveTable, mockData.responseObj);
    expect(moveTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(moveTableResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.move.error });
  });
});

describe('updateTable', () => {
  let updateTableResStatusSpy;
  let updateTableResSendSpy;
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateTableResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    updateTableResSendSpy = sinon.spy(mockData.responseObj, 'send');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
    sinon.stub(filer, 'moveFile');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('Checking the flow till mongo db for update table', () => {
    it('checking the status and code', async () => {
      await controllers.updateTable(mockData.requestobj, mockData.responseObj);
      expect(updateTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
      expect(updateTableResSendSpy.firstCall.args[0].result.columns[0]).to.deep.include(mockData.mongoClientResult.updateTable);
      expect(updateTableResSendSpy.firstCall.args[0].result.columns[0]).to.have.property('_id');
      expect(updateTableResSendSpy.firstCall.args[0].result.columns[0]).to.have.property('createdAt').to.be.instanceOf(Date);
      expect(updateTableResSendSpy.firstCall.args[0].result.columns[0]).to.have.property('updatedAt').to.be.instanceOf(Date);
    });

    it('checking the argument for mongo db statement', async () => {
      await controllers.updateTable(mockData.requestobj, mockData.responseObj);
      expect(updateOneMongoClientStub.getCall(0).args[0]).to.equal(mockData.mongoClientParameter.updateTable[0]);
      expect(updateOneMongoClientStub.getCall(0).args[1]).to.deep.eql(mockData.mongoClientParameter.updateTable[1]);
      expect(updateOneMongoClientStub.getCall(0).args[2].$set).to.deep.include(mockData.mongoClientParameter.updateTable[2].$set);
      expect(updateOneMongoClientStub.getCall(0).args[2].$set.columns[0]).to.deep.include(mockData.mongoClientParameter.updateTable[2].columns[0]);
      expect(updateOneMongoClientStub.getCall(0).args[2].$set.columns[0]).to.have.property('updatedAt').to.be.instanceOf(Date);
      expect(updateOneMongoClientStub.getCall(0).args[2].$set.columns[0]).to.have.property('createdAt').to.be.instanceOf(Date);
    });
  });

  it('should throw error if updateOne from mongo Db throw error', async () => {
    sinon.stub(logger, 'error');
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    await controllers.updateTable(mockData.requestobj, mockData.responseObj);
    expect(updateTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(updateTableResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.update.error });
  });
});
describe('deleteTable', () => {
  let deleteTableResStatusSpy;
  let deleteTableResSendSpy;
  let deleteOneMongoClientStub;
  let updateOneMongoClientStub;

  beforeEach(() => {
    deleteTableResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    deleteTableResSendSpy = sinon.spy(mockData.responseObj, 'send');
    deleteOneMongoClientStub = sinon.stub(mongoClient, 'deleteOne');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('Checking the flow till mongo db for create table', () => {
    beforeEach(() => {
      deleteOneMongoClientStub = deleteOneMongoClientStub.returns(mockData.mongoClientResult.deleteOne);
    });

    it('checking the status and code if it delete the table successfully', async () => {
      await controllers.deleteTable(mockData.requestobj.deleteTable, mockData.responseObj);
      expect(deleteTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
      expect(deleteTableResSendSpy.firstCall.args[0].result).to.deep.equal({ ok: true });
    });

    it('checking the argument for mongo db statement', async () => {
      await controllers.deleteTable(mockData.requestobj.deleteTable, mockData.responseObj);
      expect(deleteOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteTable.deleteOne);
      expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteTable.updateOne);
    });
  });

  describe('Throwing error from mongo db', () => {
    let error;

    beforeEach(() => {
      sinon.stub(logger, 'error');
      error = new Error('mongo database');
    });

    it('should throw error if deleteOne from mongo Db throw error', async () => {
      deleteOneMongoClientStub = deleteOneMongoClientStub.throws(error);
      await controllers.deleteTable(mockData.requestobj.deleteTable, mockData.responseObj);
      expect(deleteTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(deleteTableResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.delete.error });
    });

    it('should throw error if updateOne from mongo Db throw error', async () => {
      updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
      await controllers.deleteTable(mockData.requestobj.deleteTable, mockData.responseObj);
      expect(deleteTableResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(deleteTableResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.delete.error });
    });
  });
});

describe('getColumns', () => {
  let getColumnsResStatusSpy;
  let getColumnsResSendSpy;
  let findOneMongoClientStub;

  beforeEach(() => {
    getColumnsResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getColumnsResSendSpy = sinon.spy(mockData.responseObj, 'send');
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('set code and status if operation is successful and checking the flow', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns(mockData.mongoClientResult.getColumns);
    await controllers.getColumns(mockData.requestobj.getColumns, mockData.responseObj);
    expect(findOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.table);
    expect(findOneMongoClientStub.getCall(0).args[1]._id).to.eql(mockData.mongoClientParameter.getColumns._id);
    expect(findOneMongoClientStub.getCall(0).args[2]).to.deep.equal(mockData.mongoClientParameter.getColumns.projection);
    expect(getColumnsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getColumnsResSendSpy.firstCall.args[0].result).to.deep.equal(mockData.mongoClientResult.getColumns.columns);
  });

  it('should throw error if mongo db throws error', async () => {
    sinon.stub(logger, 'error');
    const error = new Error('mongo database');
    findOneMongoClientStub = findOneMongoClientStub.throws(error);
    await controllers.getColumns(mockData.requestobj.getColumns, mockData.responseObj);
    expect(getColumnsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getColumnsResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.column.get.error });
  });
});

describe('moveColumn', () => {
  let moveColumnResStatusSpy;
  let moveColumnResSendSpy;
  let updateOneMongoClientStub;
  let findOneAndUpdateMongoClientStub;

  beforeEach(() => {
    moveColumnResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    moveColumnResSendSpy = sinon.spy(mockData.responseObj, 'send');
    findOneAndUpdateMongoClientStub = sinon.stub(mongoClient, 'findOneAndUpdate');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('checking the result and argument if successful', () => {
    beforeEach(() => {
      findOneAndUpdateMongoClientStub = findOneAndUpdateMongoClientStub.returns(mockData.mongoClientResult.findOneAndUpdate);
      updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne[0]);
    });

    it('should move the table and checking the status and code', async () => {
      await controllers.moveColumn(mockData.requestobj.moveColumn, mockData.responseObj);
      expect(moveColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
      expect(moveColumnResSendSpy.firstCall.args[0].result).to.deep.equal({ ok: true });
    });

    it('checking the mongo db argument', async () => {
      await controllers.moveColumn(mockData.requestobj.moveColumn, mockData.responseObj);
      expect(findOneAndUpdateMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.moveColumn[0]);
      expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.moveColumn[1]);
    });
  });

  describe('throwing of error from mongo db', () => {
    let error;

    beforeEach(() => {
      sinon.stub(logger, 'error');
      error = new Error('mongo database');
    });

    it('should throw error if updateOne mongo db throws error', async () => {
      updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
      await controllers.moveColumn(mockData.requestobj.moveColumn, mockData.responseObj);
      expect(moveColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(moveColumnResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.column.error });
    });

    it('should throw error if findOneAndUpdateOne mongo db throws error', async () => {
      findOneAndUpdateMongoClientStub = findOneAndUpdateMongoClientStub.throws(error);
      await controllers.moveColumn(mockData.requestobj.moveColumn, mockData.responseObj);
      expect(moveColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(moveColumnResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.column.error });
    });
  });
});

describe('deleteColumn', () => {
  let deleteColumnResStatusSpy;
  let deleteColumnResSendSpy;
  let updateOneMongoClientStub;

  beforeEach(() => {
    deleteColumnResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    deleteColumnResSendSpy = sinon.spy(mockData.responseObj, 'send');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('checking the result and argument', () => {
    beforeEach(() => {
      updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne[0]);
    });

    it('should delete the column and checking the status and code', async () => {
      await controllers.deleteColumn(mockData.requestobj.deleteColumn, mockData.responseObj);
      expect(deleteColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
      expect(deleteColumnResSendSpy.firstCall.args[0].result).to.deep.equal({ ok: true });
    });
    it('checking the mongo db argument', async () => {
      await controllers.deleteColumn(mockData.requestobj.deleteColumn, mockData.responseObj);
      expect(updateOneMongoClientStub.getCall(0).args[0]).to.deep.eql(mockData.mongoClientParameter.deleteColumn[0]);
      expect(updateOneMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.mongoClientParameter.deleteColumn[1]);
      expect(updateOneMongoClientStub.getCall(0).args[2].$pull).to.deep.eql(mockData.mongoClientParameter.deleteColumn[2].$pull);
    });
  });

  it('should throw error if mongo db throws error', async () => {
    sinon.stub(logger, 'error');
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    await controllers.deleteColumn(mockData.requestobj.deleteColumn, mockData.responseObj);
    expect(deleteColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(deleteColumnResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.column.delete.error });
  });
});

describe('updateColumn', () => {
  let updateColumnResStatusSpy;
  let updateColumnResSendSpy;
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateColumnResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    updateColumnResSendSpy = sinon.spy(mockData.responseObj, 'send');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('checking the result and argument', () => {
    beforeEach(() => {
      updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne[0]);
    });

    it('should update the table and checking the status and code', async () => {
      await controllers.updateColumn(mockData.requestobj.updateColumn, mockData.responseObj);
      expect(updateColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
      expect(updateColumnResSendSpy.firstCall.args[0].result).to.deep.equal({ ok: true });
    });
    it('checking the mongo db argument', async () => {
      await controllers.updateColumn(mockData.requestobj.updateColumn, mockData.responseObj);
      expect(updateOneMongoClientStub.getCall(0).args[0]).to.deep.eql(mockData.mongoClientParameter.updateColumn[0]);
      expect(updateOneMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.mongoClientParameter.updateColumn[1]);
      expect(updateOneMongoClientStub.getCall(0).args[2].$set).to.deep.include(mockData.mongoClientParameter.updateColumn[2].$set);
      expect(updateOneMongoClientStub.getCall(0).args[2].$set).to.have.property('columns.$.updatedAt').to.be.instanceOf(Date);
    });
  });

  it('should throw error if mongo db throws error', async () => {
    sinon.stub(logger, 'error');
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    await controllers.updateColumn(mockData.requestobj.updateColumn, mockData.responseObj);
    expect(updateColumnResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(updateColumnResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.column.update.error });
  });
});

describe('createColumn', () => {
  let createColumnsResStatusSpy;
  let createColumnsResSendSpy;
  let updateOneMongoClientStub;

  beforeEach(() => {
    createColumnsResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    createColumnsResSendSpy = sinon.spy(mockData.responseObj, 'send');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('checking of argument and the result for the whole flow', () => {
    it('should create the column and checking the flow', async () => {
      await controllers.createColumn(mockData.requestobj.createColumn, mockData.responseObj);
      expect(createColumnsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.successfulCreate);
      expect(createColumnsResSendSpy.firstCall.args[0].result).to.have.all.keys('id');
    });

    it('checking the argument of mongo db statement', async () => {
      await controllers.createColumn(mockData.requestobj.createColumn, mockData.responseObj);
      expect(updateOneMongoClientStub.getCall(0).args[2].$push.columns).to.have.all.keys(mockData.properties.createColumn);
    });
  });

  it('should throw error if mongo db throws error', async () => {
    sinon.stub(logger, 'error');
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    await controllers.createColumn(mockData.requestobj, mockData.responseObj);
    expect(createColumnsResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(createColumnsResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.table.column.create.error });
  });
});
