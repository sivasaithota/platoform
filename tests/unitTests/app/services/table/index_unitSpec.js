/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const { expect } = require('../../../base');
const mockData = require('./mockData');
const tableDataService = require('../../../../../app/dataServices/table');
const tableService = require('../../../../../app/services/table');
const logger = require('../../../../../app/common/logger');
const filer = require('../../../../../app/common/filer');

describe('getTables()', () => {
  let getTablesDataServiceStub;

  beforeEach(() => {
    getTablesDataServiceStub = sinon.stub(tableDataService, 'getTables');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return all the apps sent from data service', async () => {
    getTablesDataServiceStub = getTablesDataServiceStub.returns(mockData.tableDataServiceResult.getTables);
    const result = await tableService.getTables(mockData.paramsObject, mockData.queryObject);
    expect(getTablesDataServiceStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.tableDataServiceResult.getTables);
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Application Data Services');
    getTablesDataServiceStub = getTablesDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await tableService.getTables(mockData.paramsObject, mockData.queryObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('createTable()', () => {
  let createTableDataServiceStub;
  let moveFileFilerStub;

  beforeEach(() => {
    createTableDataServiceStub = sinon.stub(tableDataService, 'createTable');
    moveFileFilerStub = sinon.stub(filer, 'moveFile');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should create table and checking the result', async () => {
    createTableDataServiceStub = createTableDataServiceStub.returns(mockData.tableDataServiceResult.insertOne);
    const result = await tableService.createTable(mockData.paramsObject, mockData.tableObject, mockData.userObject);
    expect(createTableDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ id: mockData.tableDataServiceResult.insertOne.insertedId });
  });

  it('should not call moveFile if fileName is not present in tableObject', async () => {
    createTableDataServiceStub = createTableDataServiceStub.returns(mockData.tableDataServiceResult.insertOne);
    await tableService.createTable(mockData.paramsObject, {}, mockData.userObject);
    expect(moveFileFilerStub.calledOnce).to.be.false;
  });
  describe('to check the argument are called as expected', () => {
    beforeEach(() => {
      createTableDataServiceStub = createTableDataServiceStub.returns(mockData.tableDataServiceResult.insertOne);
    });

    it('checking create table Data Service', async () => {
      await tableService.createTable(mockData.paramsObject, mockData.tableObject, mockData.userObject);
      expect(createTableDataServiceStub.getCall(0).args[0]).to.equal(mockData.paramsObject.appId);
      expect(createTableDataServiceStub.getCall(0).args[1]).to.have.all.keys(mockData.properties.createTable);
    });

    it('checking moveFile from Filer', async () => {
      await tableService.createTable(mockData.paramsObject, mockData.tableObject, mockData.userObject);
      expect(moveFileFilerStub.getCall(0).args).to.eql(mockData.mongoClientParameter.movefileFiler);
    });
  });

  describe('checking if the respective function throwing error', () => {
    let error;
  
    beforeEach(() => {
      error = new Error('Error thrown');
      sinon.stub(logger, 'error');
    });

    it('Table data Service', async () => {
      createTableDataServiceStub = createTableDataServiceStub.throws(error);
      try {
        await tableService.createTable(mockData.paramsObject, mockData.tableObject, mockData.userObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('From moveFile Filer', async () => {
      moveFileFilerStub = moveFileFilerStub.throws(error);
      try {
        await tableService.createTable(mockData.paramsObject, mockData.tableObject, mockData.userObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });
});

describe('moveTable()', () => {
  let moveTableDataServiceStub;

  beforeEach(() => {
    moveTableDataServiceStub = sinon.stub(tableDataService, 'moveTable');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return result after move data service is called and checking the argument', async () => {
    moveTableDataServiceStub = moveTableDataServiceStub.returns(mockData.tableDataServiceResult.updateOne[0]);
    const result = await tableService.moveTable(mockData.paramsObject, mockData.moveObject.position);
    expect(moveTableDataServiceStub.calledOnce).to.be.true;
    expect(moveTableDataServiceStub.getCall(0).args[0]).to.eql(mockData.paramsObject);
    expect(moveTableDataServiceStub.getCall(0).args[1]).to.eql(mockData.moveObject.position);
    expect(result).to.eql({ ok: true });
  });

  it('should return false if updateOne failed', async () => {
    moveTableDataServiceStub = moveTableDataServiceStub.returns(mockData.tableDataServiceResult.updateOne[1]);
    const result = await tableService.moveTable(mockData.paramsObject, mockData.moveObject.position);
    expect(moveTableDataServiceStub.calledOnce).to.be.true;
    expect(moveTableDataServiceStub.getCall(0).args[0]).to.eql(mockData.paramsObject);
    expect(moveTableDataServiceStub.getCall(0).args[1]).to.eql(mockData.moveObject.position);
    expect(result).to.eql({ ok: false });
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Application Data Services');
    moveTableDataServiceStub = moveTableDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await tableService.moveTable(mockData.paramsObject, mockData.moveObject.position);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('updateTable()', () => {
  let updateTableDataServiceStub;
  let moveFileFilerStub;

  beforeEach(() => {
    updateTableDataServiceStub = sinon.stub(tableDataService, 'updateTable');
    moveFileFilerStub = sinon.stub(filer, 'moveFile');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return empty object when no column is updated', async () => {
    const result = await tableService.updateTable(mockData.paramsObject, mockData.parameter.updateTable.tableObjectNoTable, mockData.userObject);
    expect(updateTableDataServiceStub.calledOnce).to.be.true;
    expect(moveFileFilerStub.calledOnce).to.be.false;
    expect(result).to.eql({});
  });

  it('should return column if table is updated', async () => {
    const result = await tableService.updateTable(mockData.paramsObject, mockData.parameter.updateTable.tableObjectTable, mockData.userObject);
    expect(updateTableDataServiceStub.calledOnce).to.be.true;
    expect(moveFileFilerStub.calledOnce).to.be.true;
    expect(moveFileFilerStub.getCall(0).args).to.eql(mockData.mongoClientParameter.movefileFiler);
    expect(result).to.have.property('columns').to.equal(mockData.parameter.updateTable.tableObjectTable.columns);
  });

  describe('to check the argument are called as expected', () => {
    it('checking argument ', async () => {
      await tableService.updateTable(mockData.paramsObject, mockData.parameter.updateTable.tableObjectNoTable, mockData.userObject);
      expect(updateTableDataServiceStub.getCall(0).args[0]).to.equal(mockData.paramsObject.tableId);
      expect(updateTableDataServiceStub.getCall(0).args[1]).to.deep.include(mockData.mongoClientParameter.updateTable[0]);
      expect(updateTableDataServiceStub.getCall(0).args[1]).to.have.property('updatedAt').to.be.instanceOf(Date);
    });

    it('checking moveFile from Filer and checking the ', async () => {
      await tableService.updateTable(mockData.paramsObject, mockData.parameter.updateTable.tableObjectTable, mockData.userObject);
      expect(updateTableDataServiceStub.getCall(0).args[0]).to.equal(mockData.paramsObject.tableId);
      expect(updateTableDataServiceStub.getCall(0).args[1]).to.deep.include(mockData.mongoClientParameter.updateTable[1]);
      expect(updateTableDataServiceStub.getCall(0).args[1]).to.have.property('updatedAt').to.be.instanceOf(Date);
    });
  });

  describe('checking if the respective function throwing error', () => {
    let error;

    beforeEach(() => {
      error = new Error('Error thrown');
      sinon.stub(logger, 'error');
    });

    it('Table data Service', async () => {
      updateTableDataServiceStub = updateTableDataServiceStub.throws(error);
      try {
        await tableService.updateTable(mockData.paramsObject, mockData.parameter.updateTable.tableObjectTable, mockData.userObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('From moveFile Filer', async () => {
      moveFileFilerStub = moveFileFilerStub.throws(error);
      try {
        await tableService.updateTable(mockData.paramsObject, mockData.parameter.updateTable.tableObjectTable, mockData.userObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });
});

describe('deleteTable()', () => {
  let deleteTableDataServiceStub;

  beforeEach(() => {
    deleteTableDataServiceStub = sinon.stub(tableDataService, 'deleteTable');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return result after delete data service is called and checking the argument', async () => {
    deleteTableDataServiceStub = deleteTableDataServiceStub.returns(mockData.tableDataServiceResult.deleteOne);
    const result = await tableService.deleteTable(mockData.paramsObject, mockData.moveObject.position);
    expect(deleteTableDataServiceStub.calledOnce).to.be.true;
    expect(deleteTableDataServiceStub.getCall(0).args[0]).to.eql(mockData.paramsObject);
    expect(deleteTableDataServiceStub.getCall(0).args[1]).to.eql(mockData.moveObject.position);
    expect(result).to.eql({ ok: true });
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Application Data Services');
    deleteTableDataServiceStub = deleteTableDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await tableService.deleteTable(mockData.paramsObject, mockData.moveObject.position);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getColumns()', () => {
  let getColumnsDataServiceStub;

  beforeEach(() => {
    getColumnsDataServiceStub = sinon.stub(tableDataService, 'getColumns');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return all the columns sent from getColumns data service', async () => {
    getColumnsDataServiceStub = getColumnsDataServiceStub.returns(mockData.tableDataServiceResult.getColumns);
    const result = await tableService.getColumns(mockData.paramsObject);
    expect(getColumnsDataServiceStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.tableDataServiceResult.getColumns.columns);
  });

  it('should return empty array if result is empty from getColumns data service', async () => {
    getColumnsDataServiceStub = getColumnsDataServiceStub.returns([]);
    const result = await tableService.getColumns(mockData.paramsObject);
    expect(getColumnsDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql([]);
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Application Data Services');
    getColumnsDataServiceStub = getColumnsDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await tableService.getColumns(mockData.paramsObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('moveColumn()', () => {
  let moveColumnDataServiceStub;

  beforeEach(() => {
    moveColumnDataServiceStub = sinon.stub(tableDataService, 'moveColumn');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return successful from data service', async () => {
    moveColumnDataServiceStub = moveColumnDataServiceStub.returns(mockData.tableDataServiceResult.updateOne[0]);
    const result = await tableService.moveColumn(mockData.paramsObject, mockData.moveObject);
    expect(moveColumnDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ ok: true });
  });

  it('should return false if none of the column are deleted', async () => {
    moveColumnDataServiceStub = moveColumnDataServiceStub.returns(mockData.tableDataServiceResult.updateOne[1]);
    const result = await tableService.moveColumn(mockData.paramsObject, mockData.moveObject);
    expect(moveColumnDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ ok: false });
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Application Data Services');
    moveColumnDataServiceStub = moveColumnDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await tableService.moveColumn(mockData.paramsObject, mockData.moveObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('deleteColumn()', () => {
  let deleteColumnDataServiceStub;

  beforeEach(() => {
    deleteColumnDataServiceStub = sinon.stub(tableDataService, 'deleteColumn');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should update the deleted column from data service', async () => {
    deleteColumnDataServiceStub = deleteColumnDataServiceStub.returns(mockData.tableDataServiceResult.updateOne[0]);
    const result = await tableService.deleteColumn(mockData.paramsObject);
    expect(deleteColumnDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ ok: true });
  });

  it('should return false if none of the column are updated', async () => {
    deleteColumnDataServiceStub = deleteColumnDataServiceStub.returns(mockData.tableDataServiceResult.updateOne[1]);
    const result = await tableService.deleteColumn(mockData.paramsObject);
    expect(deleteColumnDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ ok: false });
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Application Data Services');
    deleteColumnDataServiceStub = deleteColumnDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await tableService.deleteColumn(mockData.paramsObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('updateColumn()', () => {
  let updateColumnDataServiceStub;

  beforeEach(() => {
    updateColumnDataServiceStub = sinon.stub(tableDataService, 'updateColumn');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should updateColumn with the right argument and result', async () => {
    updateColumnDataServiceStub = updateColumnDataServiceStub.returns(mockData.tableDataServiceResult.updateOne[0]);
    const result = await tableService.updateColumn(mockData.paramsObject, mockData.columnObject, mockData.userObject);
    expect(updateColumnDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ ok: true });
    expect(updateColumnDataServiceStub.getCall(0).args[0]).to.eql(mockData.mongoClientParameter.updateColumn[0]);
    expect(updateColumnDataServiceStub.getCall(0).args[1]).to.have.property('updatedAt').to.be.instanceOf(Date);
    expect(updateColumnDataServiceStub.getCall(0).args[1]).to.include(mockData.mongoClientParameter.updateColumn[1]);
  });

  it('should return false if none of the column are updated', async () => {
    updateColumnDataServiceStub = updateColumnDataServiceStub.returns(mockData.tableDataServiceResult.updateOne[1]);
    const result = await tableService.updateColumn(mockData.paramsObject, mockData.columnObject, mockData.userObject);
    expect(updateColumnDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ ok: false });
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Application Data Services');
    updateColumnDataServiceStub = updateColumnDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await tableService.updateColumn(mockData.paramsObject, mockData.columnObject, mockData.userObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('createColumn()', () => {
  let createColumnDataServiceStub;

  beforeEach(() => {
    createColumnDataServiceStub = sinon.stub(tableDataService, 'createColumn');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return _id for the created column', async () => {
    createColumnDataServiceStub = createColumnDataServiceStub.returns(mockData.tableDataServiceResult.createColumn._id);
    const result = await tableService.createColumn(mockData.paramsObject, mockData.columnObject, mockData.userObject);
    expect(createColumnDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ id: mockData.tableDataServiceResult.createColumn._id });
    expect(createColumnDataServiceStub.getCall(0).args[1]).to.have.all.keys(mockData.properties.createColumn);
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Application Data Services');
    createColumnDataServiceStub = createColumnDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await tableService.createColumn(mockData.paramsObject, mockData.columnObject, mockData.userObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});
