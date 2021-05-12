/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const { expect } = require('../../../base');
const mockData = require('./mockData');
const constants = require('../../../../../app/common/constants');
const mongoClient = require('../../../../../app/dataServices/mongoClient');
const tableDataService = require('../../../../../app/dataServices/table');

describe('getTables', () => {
  let findMongoClientStub;

  beforeEach(() => {
    findMongoClientStub = sinon.stub(mongoClient, 'find');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether aggregate is called, checking the argument and the result', async () => {
    findMongoClientStub.returns(mockData.mongoClientResult.getTables);
    const result = await tableDataService.getTables(mockData.idObject.appId, mockData.queryObject.type);
    expect(findMongoClientStub.calledOnce).to.be.true;
    expect(findMongoClientStub.getCall(0).args).to.deep.equal(mockData.mongoClientParameter.getTables);
    expect(result).to.equal(mockData.mongoClientResult.getTables);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findMongoClientStub = findMongoClientStub.throws(error);
    try {
      await tableDataService.getTables(mockData.idObject.appId, mockData.queryObject.type);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('createTable', () => {
  let insertOneMongoClientStub;
  let countDocumentsMongoClientStub;

  beforeEach(() => {
    insertOneMongoClientStub = sinon.stub(mongoClient, 'insertOne');
    countDocumentsMongoClientStub = sinon.stub(mongoClient, 'countDocuments');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether insertOne and countDocuments is called and the checking the result', async () => {
    insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.mongoClientResult.insertOne);
    countDocumentsMongoClientStub = countDocumentsMongoClientStub.returns(2);
    const result = await tableDataService.createTable(mockData.idObject.appId, mockData.parameter.createTable.tableObject);
    expect(insertOneMongoClientStub.calledOnce).to.be.true;
    expect(countDocumentsMongoClientStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.mongoClientResult.insertOne);
  });

  it('should check whether insertOne and countDocuments is called with right argument', async () => {
    countDocumentsMongoClientStub = countDocumentsMongoClientStub.returns(2);
    insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.mongoClientResult.insertOne);
    await tableDataService.createTable(mockData.idObject.appId, mockData.parameter.createTable.tableObject);
    expect(insertOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.table);
    expect(insertOneMongoClientStub.getCall(0).args[1]).to.have.all.keys(mockData.properties.createTable[0]);
    expect(insertOneMongoClientStub.getCall(0).args[1].columns[0]).to.have.all.keys(mockData.properties.createTable[1]);
  });

  it('should throw error if insertOne mongo db throw error', async () => {
    const error = new Error('mongo database');
    insertOneMongoClientStub = insertOneMongoClientStub.throws(error);
    try {
      await tableDataService.createTable(mockData.idObject.appId,mockData.parameter.createTable.tableObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should throw error if countDocuments mongo db throw error', async () => {
    const error = new Error('mongo database');
    insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.mongoClientResult.insertOne);
    countDocumentsMongoClientStub = countDocumentsMongoClientStub.throws(error);
    try {
      await tableDataService.createTable(mockData.idObject.appId, mockData.parameter.createTable.tableObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('moveTable', () => {
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether update is called with right argument and the checking the result', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    const result = await tableDataService.moveTable(mockData.idObject, mockData.position);
    expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.moveTable[0]);
    expect(updateOneMongoClientStub.getCall(1).args).to.eql(mockData.mongoClientParameter.moveTable[1]);
    expect(result).to.equal(mockData.mongoClientResult.updateOne);
  });

  it('should throw error if mongo db updateOne throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await tableDataService.moveTable(mockData.idObject, mockData.position);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('deleteTable', () => {
  let deleteOneMongoClientStub;
  let updateOneMongoClientStub;

  beforeEach(() => {
    deleteOneMongoClientStub = sinon.stub(mongoClient, 'deleteOne');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether deleteOne is called and the checking the result if delete table is successful', async () => {
    deleteOneMongoClientStub = deleteOneMongoClientStub.returns(mockData.mongoClientResult.deleteOne);
    const result = await tableDataService.deleteTable(mockData.idObject);
    expect(deleteOneMongoClientStub.calledOnce).to.be.true;
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.mongoClientResult.deleteOne);
  });

  it('should check the argument for deleteOne and updateOne mongoClient', async () => {
    deleteOneMongoClientStub = deleteOneMongoClientStub.returns(mockData.mongoClientResult.deleteOne);
    await tableDataService.deleteTable(mockData.idObject);
    expect(deleteOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteTable.deleteOne);
    expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteTable.updateOne);
  });

  describe('throwing error', () => {
    let error;

    beforeEach(() => {
      error = new Error('Mongo database');
    });

    it('should throw error if mongo db deleteOne throw error', async () => {
      deleteOneMongoClientStub = deleteOneMongoClientStub.throws(error);
      try {
        await tableDataService.deleteTable(mockData.idObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('should throw error if mongo db updateOne throw error', async () => {
      updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
      try {
        await tableDataService.deleteTable(mockData.idObject);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });
});

describe('updateTable', () => {
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether updateOne is called with right argument and the checking the result', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    const result = await tableDataService.updateTable(mockData.idObject.tableId, mockData.parameter.tableObject);
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(updateOneMongoClientStub.getCall(0).args[0]).to.equal(mockData.mongoClientParameter.updateTable[0]);
    expect(updateOneMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.mongoClientParameter.updateTable[1]);
    expect(updateOneMongoClientStub.getCall(0).args[2].$set).to.deep.include(mockData.mongoClientParameter.updateTable[2].$set);
    expect(updateOneMongoClientStub.getCall(0).args[2].$set.columns[0]).to.deep.include(mockData.mongoClientParameter.updateTable[2].columns[0]);
    expect(updateOneMongoClientStub.getCall(0).args[2].$set.columns[0]).to.have.property('_id');
    expect(result).to.equal(mockData.mongoClientResult.updateOne);
  });

  it('should throw error if insertOne mongo db throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await tableDataService.updateTable(mockData.idObject.tableId, mockData.parameter.tableObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getColumns', () => {
  let findOneMongoClientStub;

  beforeEach(() => {
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether findOne is called, checking the argument and the result', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns(mockData.mongoClientResult.getColumns);
    const result = await tableDataService.getColumns(mockData.idObject);
    expect(findOneMongoClientStub.calledOnce).to.be.true;
    expect(findOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.getColumns);
    expect(result).to.equal(mockData.mongoClientResult.getColumns);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findOneMongoClientStub = findOneMongoClientStub.throws(error);
    try {
      await tableDataService.getColumns(mockData.idObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should return empty array if result is empty', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns([]);
    const result = await tableDataService.getColumns(mockData.idObject);
    expect(findOneMongoClientStub.calledOnce).to.be.true;
    expect(findOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.getColumns);
    expect(result).to.eql([]);
  });
});

describe('moveColumn', () => {
  let findOneAndUpdateMongoClientStub;
  let updateOneMongoClientStub;

  beforeEach(() => {
    findOneAndUpdateMongoClientStub = sinon.stub(mongoClient, 'findOneAndUpdate');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether result is as expected', async () => {
    findOneAndUpdateMongoClientStub = findOneAndUpdateMongoClientStub.returns(mockData.mongoClientResult.findOneAndUpdate);
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    const result = await tableDataService.moveColumn(mockData.idObject, mockData.position);
    expect(result).to.eql(mockData.mongoClientResult.updateOne);
  });

  it('should check whether update is called with right argument and the checking the result', async () => {
    findOneAndUpdateMongoClientStub = findOneAndUpdateMongoClientStub.returns(mockData.mongoClientResult.findOneAndUpdate);
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    await tableDataService.moveColumn(mockData.idObject, mockData.position);
    expect(findOneAndUpdateMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.moveColumn[0]);
    expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.moveColumn[1]);
  });

  it('should throw error if updateOne mongo db throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    findOneAndUpdateMongoClientStub = findOneAndUpdateMongoClientStub.returns(mockData.mongoClientResult.findOneAndUpdate);
    try {
      await tableDataService.moveColumn(mockData.idObject, mockData.position);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should throw error if findOneandUpdate throw error', async () => {
    const error = new Error('mongo database');
    findOneAndUpdateMongoClientStub = findOneAndUpdateMongoClientStub.throws(error);
    try {
      await tableDataService.moveColumn(mockData.idObject, mockData.position);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('deleteColumn', () => {
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether update is called with right argument and the checking the result', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    const result = await tableDataService.deleteColumn(mockData.idObject);
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteColumn);
    expect(result).to.eql(mockData.mongoClientResult.updateOne);
  });

  it('should throw error if mongo db deleteOne throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await tableDataService.deleteColumn(mockData.idObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('updateColumn', () => {
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether updateOne is called with right argument and the checking the result', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    const result = await tableDataService.updateColumn(mockData.idObject, mockData.columnObject);
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.updateColumn);
    expect(result).to.equal(mockData.mongoClientResult.updateOne);
  });

  it('should throw error if mongo db updateOne throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await tableDataService.updateColumn(mockData.idObject, mockData.columnObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('createColumn', () => {
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether updateOne is called with right argument and the checking the result', async () => {
    await tableDataService.createColumn(mockData.idObject.tableId, mockData.columnObject);
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(updateOneMongoClientStub.getCall(0).args[2].$push.columns).to.have.all.keys(mockData.properties.createColumn);
  });

  it('should throw error if mongo db updateOne throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await tableDataService.createColumn(mockData.idObject.tableId, mockData.columnObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});
