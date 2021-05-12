/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const { expect } = require('../../../base');
const mockData = require('./mockData');
const mongoClient = require('../../../../../app/dataServices/mongoClient');
const parameterDataService = require('../../../../../app/dataServices/parameter');
const dataServiceConstants = require('../../../../../app/dataServices/parameter/constants');
const constants = require('../../../../../app/common/constants');

describe('getParameters', () => {
  let aggregateMongoClientStub;

  beforeEach(() => {
    aggregateMongoClientStub = sinon.stub(mongoClient, 'aggregate');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether aggregate is called, checking the argument and the result', async () => {
    const getParametersAggregatePipelinedataServiceConstantsSpy = sinon.spy(dataServiceConstants, 'getParametersAggregatePipeline');
    aggregateMongoClientStub = aggregateMongoClientStub.returns(mockData.mongoClientResult.getParameters);
    const result = await parameterDataService.getParameters(mockData.idObject.appId);
    expect(aggregateMongoClientStub.calledOnce).to.be.true;
    expect(aggregateMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(aggregateMongoClientStub.getCall(0).args[1]).to.deep.equal(getParametersAggregatePipelinedataServiceConstantsSpy.returnValues[0]);
    expect(result).to.equal(mockData.mongoClientResult.getParameters);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    aggregateMongoClientStub = aggregateMongoClientStub.throws(error);
    try {
      await parameterDataService.getParameters(mockData.idObject.appId);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should return empty empty array if result is empty', async () => {
    const getParametersAggregatePipelinedataServiceConstantsSpy = sinon.spy(dataServiceConstants, 'getParametersAggregatePipeline');
    aggregateMongoClientStub = aggregateMongoClientStub.returns([]);
    const result = await parameterDataService.getParameters(mockData.idObject.appId);
    expect(aggregateMongoClientStub.calledOnce).to.be.true;
    expect(aggregateMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(aggregateMongoClientStub.getCall(0).args[1]).to.deep.equal(getParametersAggregatePipelinedataServiceConstantsSpy.returnValues[0]);
    expect(result).to.deep.equal([]);
  });
});

describe('createParameterGroup', () => {
  let updateOneMongoClientStub;
  let insertOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
    insertOneMongoClientStub = sinon.stub(mongoClient, 'insertOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether insertOne and updateOne is called and the checking the result', async () => {
    insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.mongoClientResult.insertOne);
    const result = await parameterDataService.createParameterGroup(mockData.idObject.appId, mockData.parameterGroupObject.createParameterGroup);
    expect(insertOneMongoClientStub.calledOnce).to.be.true;
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.mongoClientResult.insertOne);
  });

  it('should check whether insertOne and updateOne is called with right argument', async () => {
    insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.mongoClientResult.insertOne);
    await parameterDataService.createParameterGroup(mockData.idObject.appId, mockData.parameterGroupObject.createParameterGroup);
    expect(insertOneMongoClientStub.getCall(0).args[0]).to.equal(mockData.mongoClientParameter.createParameterGroup.insertOne[0]);
    expect(insertOneMongoClientStub.getCall(0).args[1]).to.deep.include(mockData.mongoClientParameter.createParameterGroup.insertOne[1]);
    expect(insertOneMongoClientStub.getCall(0).args[1]).to.have.property('createdAt').to.be.instanceOf(Date);
    expect(insertOneMongoClientStub.getCall(0).args[1]).to.have.property('updatedAt').to.be.instanceOf(Date);
    expect(updateOneMongoClientStub.getCall(0).args).to.deep.equal(mockData.mongoClientParameter.createParameterGroup.updateOne);
  });

  it('should throw error if insertOne mongo db throw error', async () => {
    const error = new Error('mongo database');
    insertOneMongoClientStub = insertOneMongoClientStub.throws(error);
    try {
      await parameterDataService.createParameterGroup(mockData.idObject.appId, mockData.parameterGroupObject.createParameterGroup);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should throw error if updateOne mongo db throw error', async () => {
    const error = new Error('mongo database');
    insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.mongoClientResult.insertOne);
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await parameterDataService.createParameterGroup(mockData.idObject.appId, mockData.parameterGroupObject.createParameterGroup);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('updateParameterGroup', () => {
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether updateOne is called with right argument and the checking the result', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    const result = await parameterDataService.updateParameterGroup(mockData.idObject, mockData.parameterGroupObject.updateParameterGroup);
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(updateOneMongoClientStub.getCall(0).args[0]).to.equal(mockData.mongoClientParameter.updateParameterGroup[0]);
    expect(updateOneMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.mongoClientParameter.updateParameterGroup[1]);
    expect(updateOneMongoClientStub.getCall(0).args[2].$set).to.deep.include(mockData.mongoClientParameter.updateParameterGroup[2].$set);
    expect(updateOneMongoClientStub.getCall(0).args[2].$set).to.have.property('updatedAt').to.be.instanceOf(Date);
    expect(result).to.equal(mockData.mongoClientResult.updateOne);
  });

  it('should throw error if insertOne mongo db throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await parameterDataService.updateParameterGroup(mockData.idObject, mockData.parameterGroupObject.updateParameterGroup);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('moveParameterGroup', () => {
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether update is called with right argument and the checking the result', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    const result = await parameterDataService.moveParameterGroup(mockData.idObject, mockData.position);
    expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.moveParameterGroup[0]);
    expect(updateOneMongoClientStub.getCall(1).args).to.eql(mockData.mongoClientParameter.moveParameterGroup[1]);
    expect(result).to.equal(mockData.mongoClientResult.updateOne);
  });

  it('should throw error if mongo db updateOne throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await parameterDataService.moveParameterGroup(mockData.idObject, mockData.position);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('createParameter', () => {
  let updateOneMongoClientStub;
  let insertOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
    insertOneMongoClientStub = sinon.stub(mongoClient, 'insertOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should check whether insertOne and updateOne is called and the checking the result', async () => {
    insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.mongoClientResult.insertOne);
    const result = await parameterDataService.createParameter(mockData.idObject, mockData.parameterObject.createParameter, mockData.position);
    expect(insertOneMongoClientStub.calledOnce).to.be.true;
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.mongoClientResult.insertOne);
  });

  it('should check whether insertOne and updateOne is called with right argument', async () => {
    insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.mongoClientResult.insertOne);
    await parameterDataService.createParameter(mockData.idObject, mockData.parameterObject.createParameter, mockData.position);
    expect(insertOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.parameter);
    expect(insertOneMongoClientStub.getCall(0).args[1]).to.have.all.keys(mockData.properties.createParameter[0]);
    console.log(updateOneMongoClientStub.getCall(0).args);
    expect(updateOneMongoClientStub.getCall(0).args).to.deep.equal(mockData.mongoClientParameter.createParameter.updateOne);
  });

  it('should throw error if insertOne mongo db throw error', async () => {
    const error = new Error('mongo database');
    insertOneMongoClientStub = insertOneMongoClientStub.throws(error);
    try {
      await parameterDataService.createParameter(mockData.idObject, mockData.parameterObject.createParameter, mockData.position);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should throw error if updateOne mongo db throw error', async () => {
    const error = new Error('mongo database');
    insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.mongoClientResult.insertOne);
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await parameterDataService.createParameter(mockData.idObject, mockData.parameterObject.createParameter, mockData.position);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('updateparameter', () => {
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });
  it('should check whether insertOne and updateOne is called and the checking the result', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    const result = await parameterDataService.updateParameter(mockData.idObject, mockData.parameterObject.updateParameter, mockData.position);
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.mongoClientResult.updateOne);
  });

  it('should check whether updateOne is called with right argument', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    await parameterDataService.updateParameter(mockData.idObject, mockData.parameterObject.updateParameter, mockData.position);
    expect(updateOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.parameter);
    expect(updateOneMongoClientStub.getCall(0).args[1]).to.eql({ _id: mongoClient.getObjectId(mockData.idObject.parameterId) });
    expect(updateOneMongoClientStub.getCall(0).args[2].$set).to.have.all.keys(mockData.properties.updateParameter[0]);
    expect(updateOneMongoClientStub.getCall(0).args[2].$set.specificProperties).to.have.all.keys(mockData.properties.updateParameter[1]);
  });

  it('should throw error if insertOne mongo db throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await parameterDataService.updateParameter(mockData.idObject, mockData.parameterObject.updateParameter, mockData.position);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});