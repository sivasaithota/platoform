/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const { expect } = require('../../../base');
const mockData = require('./mockData');
const parameterDataService = require('../../../../../app/dataServices/parameter');
const parameterService = require('../../../../../app/services/parameter');
const logger = require('../../../../../app/common/logger');
const commonServices = require('../../../../../app/services/common');

describe('getParameters()', () => {
  let getParametersDataServiceStub;

  beforeEach(() => {
    getParametersDataServiceStub = sinon.stub(parameterDataService, 'getParameters');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return all the parameter from data service', async () => {
    getParametersDataServiceStub = getParametersDataServiceStub.returns(mockData.parameterDataServiceResult.getParameters);
    const result = await parameterService.getParameters(mockData.paramsObject);
    expect(getParametersDataServiceStub.calledOnce).to.be.true;
    expect(result).to.equal(mockData.parameterDataServiceResult.getParameters);
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Parameter Data Services');
    getParametersDataServiceStub = getParametersDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await parameterService.getParameters(mockData.paramsObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('createParameterGroup()', () => {
  let createParameterDataServiceStub;

  beforeEach(() => {
    createParameterDataServiceStub = sinon.stub(parameterDataService, 'createParameterGroup');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should create Parameter Group and checking the result', async () => {
    createParameterDataServiceStub = createParameterDataServiceStub.returns(mockData.parameterDataServiceResult.insertOne);
    const result = await parameterService.createParameterGroup(mockData.paramsObject, mockData.parameterObject.createParameterGroup, mockData.userObject);
    expect(createParameterDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ id: mockData.parameterDataServiceResult.insertOne.insertedId });
  });

  it('checking create Parameter Data Service argument', async () => {
    createParameterDataServiceStub = createParameterDataServiceStub.returns(mockData.parameterDataServiceResult.insertOne);
    await parameterService.createParameterGroup(mockData.paramsObject, mockData.parameterObject.createParameterGroup, mockData.userObject);
    expect(createParameterDataServiceStub.getCall(0).args[0]).to.equal(mockData.paramsObject.appId);
    expect(createParameterDataServiceStub.getCall(0).args[1]).to.deep.include(mockData.mongoClientParameter.createParameterGroup);
    expect(createParameterDataServiceStub.getCall(0).args[1]).to.have.property('createdAt').to.be.instanceOf(Date);
  });

  it('Parameter data Service throwing error', async () => {
    const error = new Error('Error thrown');
    sinon.stub(logger, 'error');
    createParameterDataServiceStub = createParameterDataServiceStub.throws(error);
    try {
      await parameterService.createParameterGroup(mockData.paramsObject, mockData.parameterObject.createParameterGroup, mockData.userObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('updateParameterGroup()', () => {
  let updateParameterGroupDataServiceStub;

  beforeEach(() => {
    updateParameterGroupDataServiceStub = sinon.stub(parameterDataService, 'updateParameterGroup');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return true if ParameterGroup is updated', async () => {
    updateParameterGroupDataServiceStub = updateParameterGroupDataServiceStub.returns(mockData.parameterDataServiceResult.updateOne[0]);
    const result = await parameterService.updateParameterGroup(mockData.paramsObject, mockData.parameterObject.updateParameterGroup, mockData.userObject);
    expect(updateParameterGroupDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ ok: true });
  });

  it('checking argument are passed as expected', async () => {
    updateParameterGroupDataServiceStub = updateParameterGroupDataServiceStub.returns(mockData.parameterDataServiceResult.updateOne[0]);
    await parameterService.updateParameterGroup(mockData.paramsObject, mockData.parameterObject.updateParameterGroup, mockData.userObject);
    expect(updateParameterGroupDataServiceStub.getCall(0).args[0]).to.eql(mockData.mongoClientParameter.updateParameterGroup[0]);
    expect(updateParameterGroupDataServiceStub.getCall(0).args[1]).to.deep.include(mockData.mongoClientParameter.updateParameterGroup[1]);
    expect(updateParameterGroupDataServiceStub.getCall(0).args[1]).to.have.property('updatedAt').to.be.instanceOf(Date);
  });

  it('checking if ParameterGroup data Service throw error', async () => {
    const error = new Error('Error thrown');
    sinon.stub(logger, 'error');
    updateParameterGroupDataServiceStub = updateParameterGroupDataServiceStub.throws(error);
    try {
      await parameterService.updateParameterGroup(mockData.paramsObject, mockData.parameterObject.updateParameterGroup, mockData.userObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('moveParameterGroup()', () => {
  let moveParameterGroupDataServiceStub;

  beforeEach(() => {
    moveParameterGroupDataServiceStub = sinon.stub(parameterDataService, 'moveParameterGroup');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return result after move data service is called and checking the argument', async () => {
    moveParameterGroupDataServiceStub = moveParameterGroupDataServiceStub.returns(mockData.parameterDataServiceResult.updateOne[0]);
    const result = await parameterService.moveParameterGroup(mockData.paramsObject, mockData.moveObject);
    expect(moveParameterGroupDataServiceStub.calledOnce).to.be.true;
    expect(moveParameterGroupDataServiceStub.getCall(0).args[0]).to.eql(mockData.paramsObject);
    expect(moveParameterGroupDataServiceStub.getCall(0).args[1]).to.equal(mockData.moveObject.position);
    expect(result).to.eql({ ok: true });
  });

  it('should return false if updateOne failed', async () => {
    moveParameterGroupDataServiceStub = moveParameterGroupDataServiceStub.returns(mockData.parameterDataServiceResult.updateOne[1]);
    const result = await parameterService.moveParameterGroup(mockData.paramsObject, mockData.moveObject);
    expect(moveParameterGroupDataServiceStub.calledOnce).to.be.true;
    expect(moveParameterGroupDataServiceStub.getCall(0).args[0]).to.eql(mockData.paramsObject);
    expect(moveParameterGroupDataServiceStub.getCall(0).args[1]).to.equal(mockData.moveObject.position);
    expect(result).to.eql({ ok: false });
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Application Data Services');
    moveParameterGroupDataServiceStub = moveParameterGroupDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await parameterService.moveParameterGroup(mockData.paramsObject, mockData.moveObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('createParameter()', () => {
  let createParameterDataServiceStub;

  beforeEach(() => {
    sinon.stub(commonServices.global, 'getParameterType').returns(mockData.commonServiceResult.getParameterType);
    createParameterDataServiceStub = sinon.stub(parameterDataService, 'createParameter');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should create Parameter and checking the result', async () => {
    createParameterDataServiceStub = createParameterDataServiceStub.returns(mockData.parameterDataServiceResult.insertOne);
    const result = await parameterService.createParameter(mockData.paramsObject.createParameter, mockData.parameterObject.createParameter, mockData.userObject, mockData.moveObject.position);
    expect(createParameterDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ id: mockData.parameterDataServiceResult.insertOne.insertedId });
  });

  it('checking create Parameter Data Service argument', async () => {
    createParameterDataServiceStub = createParameterDataServiceStub.returns(mockData.parameterDataServiceResult.insertOne);
    await parameterService.createParameter(mockData.paramsObject, mockData.parameterObject.createParameter, mockData.userObject, mockData.moveObject.position);
    console.log(createParameterDataServiceStub.getCall(0).args);
    expect(createParameterDataServiceStub.getCall(0).args[0]).to.eql(mockData.paramsObject);
    expect(createParameterDataServiceStub.getCall(0).args[1]).to.have.all.keys(mockData.properties.createParameter[0]);
    expect(createParameterDataServiceStub.getCall(0).args[1].specificProperties).to.have.all.keys(mockData.properties.createParameter[1]);
    expect(createParameterDataServiceStub.getCall(0).args[2]).to.equal(mockData.moveObject.position);
  });

  it('Parameter data Service', async () => {
    const error = new Error('Error thrown');
    sinon.stub(logger, 'error');
    createParameterDataServiceStub = createParameterDataServiceStub.throws(error);
    try {
      await parameterService.createParameter(mockData.paramsObject, mockData.parameterObject.createParameter, mockData.userObject, mockData.moveObject.position);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('deleteParameterGroup()', () => {
  let deleteParameterGroupDataServiceStub;

  beforeEach(() => {
    deleteParameterGroupDataServiceStub = sinon.stub(parameterDataService, 'deleteParameterGroup');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return result of updateMany if parameter moved to Id is given', async () => {
    deleteParameterGroupDataServiceStub = deleteParameterGroupDataServiceStub.returns(mockData.parameterDataServiceResult.updateMany);
    const result = await parameterService.deleteParameterGroup(mockData.paramsObject, mockData.queryObject);
    expect(deleteParameterGroupDataServiceStub.calledOnce).to.be.true;
    expect(deleteParameterGroupDataServiceStub.getCall(0).args[0]).to.eql(mockData.paramsObject);
    expect(deleteParameterGroupDataServiceStub.getCall(0).args[1]).to.eql(mockData.queryObject.parametersMovedToGroupId);
    expect(result).to.eql({ ok: true });
  });

  it('should return result of deleteMany if parameter moved to Id is not given', async () => {
    deleteParameterGroupDataServiceStub = deleteParameterGroupDataServiceStub.returns(mockData.parameterDataServiceResult.deleteMany);
    const result = await parameterService.deleteParameterGroup(mockData.paramsObject, {});
    expect(deleteParameterGroupDataServiceStub.calledOnce).to.be.true;
    expect(deleteParameterGroupDataServiceStub.getCall(0).args[0]).to.eql(mockData.paramsObject);
    expect(deleteParameterGroupDataServiceStub.getCall(0).args[1]).to.eql(undefined);
    expect(result).to.eql({ ok: true });
  });

  it('should throw error that is thrown from data Service', async () => {
    const error = new Error('Application Data Services');
    deleteParameterGroupDataServiceStub = deleteParameterGroupDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await parameterDataService.deleteParameterGroup(mockData.paramsObject, mockData.queryObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('deleteparameters()', () => {
  let deleteParametersDataServiceStub;

  beforeEach(() => {
    deleteParametersDataServiceStub = sinon.stub(parameterDataService, 'deleteParameters');
  });
  afterEach(() => {
    sinon.restore();
  });
  it('should return result after delete data service is called and checking the argument', async () => {
    deleteParametersDataServiceStub = deleteParametersDataServiceStub.returns(mockData.parameterDataServiceResult.deleteMany);
    const result = await parameterService.deleteParameters(mockData.deleteParametersObject);
    expect(deleteParametersDataServiceStub.calledOnce).to.be.true;
    expect(deleteParametersDataServiceStub.getCall(0).args[0]).to.eql(mockData.deleteParametersObject.parameterMap);
    expect(result).to.eql({ ok: true });
  });

  it('should throw error if data Service throw error', async () => {
    const error = new Error('Parameter Data Services');
    deleteParametersDataServiceStub = deleteParametersDataServiceStub.throws(error);
    sinon.stub(logger, 'error');
    try {
      await parameterService.deleteParameters(mockData.deleteParametersObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('moveParameter()', () => {
  let moveParameterDataServiceStub;

  beforeEach(() => {
    moveParameterDataServiceStub = sinon.stub(parameterDataService, 'moveParameters');
  });
  afterEach(() => {
    sinon.restore();
  });
  it('should move the Parameters and checking the result', async () => {
    moveParameterDataServiceStub = moveParameterDataServiceStub.returns(mockData.parameterDataServiceResult.updateOne[0]);
    const result = await parameterService.moveParameters(mockData.paramsObject, mockData.moveParmeter);
    expect(moveParameterDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ ok: true });
  });

  it('Parameter data Service throwing error', async () => {
    const error = new Error('Error thrown');
    sinon.stub(logger, 'error');
    moveParameterDataServiceStub = moveParameterDataServiceStub.throws(error);
    try {
      await parameterService.moveParameters(mockData.paramsObject, mockData.moveParmeter);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('updateParameter()', () => {
  let updateParameterDataServiceStub;

  beforeEach(() => {
    updateParameterDataServiceStub = sinon.stub(parameterDataService, 'updateParameter');
    sinon.stub(commonServices.global, 'getParameterType').returns(mockData.commonServiceResult.getParameterType);
  });

  afterEach(() => {
    sinon.restore();
  });
  it('should call the dataservices and checking the result', async () => {
    updateParameterDataServiceStub = updateParameterDataServiceStub.returns(mockData.parameterDataServiceResult.updateOne[0]);
    const result = await parameterService.updateParameter(mockData.paramsObject, mockData.parameterObject.updateParameter, mockData.userObject);
    expect(updateParameterDataServiceStub.calledOnce).to.be.true;
    expect(result).to.eql({ ok: true });
  });

  it('checking update Parameter Data Service argument', async () => {
    updateParameterDataServiceStub = updateParameterDataServiceStub.returns(mockData.parameterDataServiceResult.updateOne[0]);
    await parameterService.updateParameter(mockData.paramsObject, mockData.parameterObject.updateParameter, mockData.userObject);
    expect(updateParameterDataServiceStub.getCall(0).args[0]).to.eql(mockData.paramsObject);
    expect(updateParameterDataServiceStub.getCall(0).args[1]).to.have.all.keys(mockData.properties.updateParameter[0]);
    expect(updateParameterDataServiceStub.getCall(0).args[1].specificProperties).to.have.all.keys(mockData.properties.updateParameter[1]);
  });

  it('Parameter data Service', async () => {
    const error = new Error('Error thrown');
    sinon.stub(logger, 'error');
    updateParameterDataServiceStub = updateParameterDataServiceStub.throws(error);
    try {
      await parameterService.updateParameter(mockData.paramsObject, mockData.parameterObject.updateParameter, mockData.userObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});