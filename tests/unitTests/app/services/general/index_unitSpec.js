/* eslint-disable no-unused-vars */
const sinon = require('sinon');
const { expect } = require('../../../base');
const generalDataServices = require('../../../../../app/dataServices/global');
const generalServices = require('../../../../../app/services/global');
const constants = require('../../../../../app/common/constants');
const logger = require('../../../../../app/common/logger');
const mockData = require('./mockData');
const mongoClient = require('../../../../../app/dataServices/mongoClient');

describe('getCheckUnique', () => {
  let getCollectionPropertyValueCountDataServicesStub;

  beforeEach(() => {
    getCollectionPropertyValueCountDataServicesStub = sinon.stub(generalDataServices, 'getCollectionPropertyValueCount');
  });
  afterEach(() => {
    sinon.restore();
  });
  it('checking the result from services is as expected and checking the argument', async () => {
    getCollectionPropertyValueCountDataServicesStub = getCollectionPropertyValueCountDataServicesStub.returns(2);
    const result = await generalServices.getCheckUnique(mockData.paramsObject, mockData.queryObject);
    expect(getCollectionPropertyValueCountDataServicesStub.getCall(0).args[0]).to.eql(mockData.paramsObject.type);
    expect(getCollectionPropertyValueCountDataServicesStub.getCall(0).args[1]).to.eql(mockData.queryObject);
    expect(result).to.eql({ isUnique: false });
  });

  it('checking the result from services is as expected', async () => {
    getCollectionPropertyValueCountDataServicesStub = getCollectionPropertyValueCountDataServicesStub.returns(0);
    const result = await generalServices.getCheckUnique(mockData.paramsObject, mockData.queryObject);
    expect(result).to.eql({ isUnique: true });
  });
  
  it('checking if error is catch if dataServices throws the error', async () => {
    const error = new Error('Data Services');
    getCollectionPropertyValueCountDataServicesStub = getCollectionPropertyValueCountDataServicesStub.throws(error);
    try {
      await generalServices.getCheckUnique(mockData.paramsObject, mockData.queryObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getInfo', () => {
  let getInfoDataServices;

  beforeEach(() => {
    getInfoDataServices = sinon.stub(generalDataServices, 'getInfo');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('checking the result from services is as expected', async () => {
    getInfoDataServices = getInfoDataServices.returns(mockData.generalDataServicesResult.getInfo);
    const result = await generalServices.getInfo();
    expect(result).to.eql(mockData.generalServicesResult.getInfo);
  });
  
  it('checking if error is catch if dataServices throws the error', async () => {
    const error = new Error('Data Services');
    getInfoDataServices = getInfoDataServices.throws(error);
    try {
      await generalServices.getInfo();
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});
