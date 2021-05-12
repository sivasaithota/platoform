/* eslint-disable no-unused-vars */
const sinon = require('sinon');
const { expect } = require('../../../base');
const generalDataServices = require('../../../../../app/dataServices/global');
const constants = require('../../../../../app/common/constants');
const mockData = require('./mockData');
const mongoClient = require('../../../../../app/dataServices/mongoClient');

describe('getCollectionPropertyValueCount', () => {
  let countDocumentsMongoClientStub;

  beforeEach(() => {
    countDocumentsMongoClientStub = sinon.stub(mongoClient, 'countDocuments');
  });
  afterEach(() => {
    sinon.restore();
  });
  it('checking the result when mongoClient send the count greater than zero', async () => {
    countDocumentsMongoClientStub = countDocumentsMongoClientStub.returns(2);
    const result = await generalDataServices.getCollectionPropertyValueCount(mockData.typeName, mockData.queryObject);
    expect(countDocumentsMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(countDocumentsMongoClientStub.getCall(0).args[1]).to.eql(mockData.mongoClientParameter.getCollectionPropertyValueCount);
    expect(result).to.eql(2);
  });

  it('checking the result when mongoClient return zero count and also queryObject is empty', async () => {
    countDocumentsMongoClientStub = countDocumentsMongoClientStub.returns(0);
    const result = await generalDataServices.getCollectionPropertyValueCount(mockData.typeName, {});
    expect(countDocumentsMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(countDocumentsMongoClientStub.getCall(0).args[1]).to.eql({});
    expect(result).to.eql(0);
  });
  
  it('checking if error is catch if mongoClient throws the error', async () => {
    const error = new Error('Mongo Client Error');
    countDocumentsMongoClientStub = countDocumentsMongoClientStub.throws(error);
    try {
      await generalDataServices.getCollectionPropertyValueCount(mockData.typeName, {});
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getInfo', () => {
  let aggregateMongoClientStub;

  beforeEach(() => {
    aggregateMongoClientStub = sinon.stub(mongoClient, 'aggregate');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('checking the result when mongoClient send the Info data and also checking the result from getEnframeInfoAggregatePipeline', async () => {
    aggregateMongoClientStub = aggregateMongoClientStub.returns(mockData.mongoClientResult.getInfo);
    const result = await generalDataServices.getInfo();
    expect(aggregateMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(aggregateMongoClientStub.getCall(0).args[1]).to.eql(mockData.getEnframeInfoAggregatePipeline);
    expect(result).to.eql(mockData.generalDataServicesResult.getInfo[1]);
  });

  it('checking the result when mongoClient return empty array for Info', async () => {
    aggregateMongoClientStub = aggregateMongoClientStub.returns([]);
    const result = await generalDataServices.getInfo();
    expect(result).to.eql(mockData.generalDataServicesResult.getInfo[0]);
  });
  
  it('checking if error is catch if dataServices throws the error', async () => {
    const error = new Error('Mongo Client Error');
    aggregateMongoClientStub = aggregateMongoClientStub.throws(error);
    try {
      await generalDataServices.getInfo();
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});
