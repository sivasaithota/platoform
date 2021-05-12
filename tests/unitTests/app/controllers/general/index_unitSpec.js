/* eslint-disable no-unused-vars */
const sinon = require('sinon');
const { expect } = require('../../../base');
const controllers = require('../../../../../app/controllers/global');
const constants = require('../../../../../app/common/constants');
const logger = require('../../../../../app/common/logger');
const mockData = require('./mockData');
const mongoClient = require('../../../../../app/dataServices/mongoClient');

describe('getDatatypes', () => {
  let getDatatypesResStatusSpy;
  let getDatatypesResSendSpy;

  beforeEach(() => {
    getDatatypesResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getDatatypesResSendSpy = sinon.spy(mockData.responseObj, 'send');
  });
  afterEach(() => {
    sinon.restore();
  });
  it('checking the status and code by collecting all dataType', async () => {
    sinon.stub(mongoClient, 'findOne').returns(mockData.mongoClientResult.getDatatypes);
    await controllers.getDatatypes({}, mockData.responseObj);
    expect(getDatatypesResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getDatatypesResSendSpy.firstCall.args[0].result[0]).to.have.all.deep.keys('typeName', 'properties');
  });

  it('checking the status and code if datatype is null', async () => {
    sinon.stub(mongoClient, 'findOne').returns(null);
    await controllers.getDatatypes({}, mockData.responseObj);
    expect(getDatatypesResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getDatatypesResSendSpy.firstCall.args[0].result).to.be.a('null');
  });
   
  it('should throw error if findOne from mongo Db throws error', async () => {
    sinon.stub(logger, 'error');
    const error = new Error('mongo database');
    sinon.stub(mongoClient, 'findOne').throws(error);
    await controllers.getDatatypes({}, mockData.responseObj);
    expect(getDatatypesResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getDatatypesResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.global.datatypes.get.error });
  });
});

describe('getCheckUnique', () => {
  let getCheckUniqueResStatusSpy;
  let getCheckUniqueResSendSpy;
  let countDocumentsMongoClientStub;

  beforeEach(() => {
    getCheckUniqueResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getCheckUniqueResSendSpy = sinon.spy(mockData.responseObj, 'send');
    countDocumentsMongoClientStub = sinon.stub(mongoClient, 'countDocuments');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('checking the status and code if mongoCient return a count greater than zero (not unique) and mongoClient argument are checked', async () => {
    countDocumentsMongoClientStub = countDocumentsMongoClientStub.returns(2);
    await controllers.getCheckUnique(mockData.requestObj, mockData.responseObj);
    expect(getCheckUniqueResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(countDocumentsMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(countDocumentsMongoClientStub.getCall(0).args[1]).to.eql(mockData.mongoClientParameter.getCheckUnique);
    expect(getCheckUniqueResSendSpy.firstCall.args[0].result).to.eql({ isUnique: false });
  });

  it('checking the status and code if mongoCient return a count as zero(unique)', async () => {
    countDocumentsMongoClientStub = countDocumentsMongoClientStub.returns(0);
    await controllers.getCheckUnique(mockData.requestObj, mockData.responseObj);
    expect(getCheckUniqueResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(countDocumentsMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(countDocumentsMongoClientStub.getCall(0).args[1]).to.eql(mockData.mongoClientParameter.getCheckUnique);
    expect(getCheckUniqueResSendSpy.firstCall.args[0].result).to.eql({ isUnique: true });
  });

  it('should throw error if findOne from mongo Db throws error', async () => {
    const error = new Error('mongo database');
    countDocumentsMongoClientStub.throws(error);
    await controllers.getCheckUnique(mockData.requestObj, mockData.responseObj);
    expect(getCheckUniqueResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getCheckUniqueResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.global.checkUnique.error });
  });
});

describe('getInfo', () => {
  let getInfoResStatusSpy;
  let getInfoResSendSpy;
  let aggregateMongoClientStub;

  beforeEach(() => {
    getInfoResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getInfoResSendSpy = sinon.spy(mockData.responseObj, 'send');
    aggregateMongoClientStub = sinon.stub(mongoClient, 'aggregate');
  });
  afterEach(() => {
    sinon.restore();
  });
   
  it('checking the status and code by collecting all Info', async () => {
    aggregateMongoClientStub = aggregateMongoClientStub.returns(mockData.mongoClientResult.getInfo);
    await controllers.getInfo({}, mockData.responseObj);
    expect(getInfoResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(aggregateMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(aggregateMongoClientStub.getCall(0).args[1]).to.eql(mockData.getEnframeInfoAggregatePipeline);
    expect(getInfoResSendSpy.firstCall.args[0].result).to.eql(mockData.servicesResult.getInfo[0]);
  });

  it('checking the status and code if mongoCient return an empty Info', async () => {
    aggregateMongoClientStub = aggregateMongoClientStub.returns([]);
    await controllers.getInfo({}, mockData.responseObj);
    expect(getInfoResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getInfoResSendSpy.firstCall.args[0].result).to.eql(mockData.servicesResult.getInfo[1]);
  });
   
  it('should throw error if findOne from mongo Db throws error', async () => {
    const error = new Error('mongo database');
    aggregateMongoClientStub.throws(error);
    await controllers.getInfo({}, mockData.responseObj);
    expect(getInfoResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getInfoResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.global.info.get.error });
  });
});

describe('getParameterTypes', () => {
  let getParameterTypesResStatusSpy;
  let getParameterTypesResSendSpy;
  let findOneMongoClientStub;

  beforeEach(() => {
    getParameterTypesResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getParameterTypesResSendSpy = sinon.spy(mockData.responseObj, 'send');
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('checking the status and code by collecting all ParameterType', async () => {
    findOneMongoClientStub.returns(mockData.mongoClientResult.getParameterTypes);
    await controllers.getParameterTypes({}, mockData.responseObj);
    expect(getParameterTypesResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getParameterTypesResSendSpy.firstCall.args[0].result[0]).to.have.all.deep.keys('typeName', 'displayName', 'properties');
  });

  it('checking the status and code if ParameterType is null', async () => {
    findOneMongoClientStub.returns(null);
    await controllers.getParameterTypes({}, mockData.responseObj);
    expect(getParameterTypesResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getParameterTypesResSendSpy.firstCall.args[0].result).to.be.a('null');
  });
   
  it('should throw error if findOne from mongo Db throws error', async () => {
    const error = new Error('mongo database');
    findOneMongoClientStub.throws(error);
    await controllers.getParameterTypes({}, mockData.responseObj);
    expect(getParameterTypesResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getParameterTypesResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.global.parameterTypes.get.error });
  });
});
