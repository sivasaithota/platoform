const sinon = require('sinon');
const { expect } = require('../../../base');
const mockData = require('./mockData');
const controllers = require('../../../../../app/controllers/parameter');
const constants = require('../../../../../app/common/constants');
const mongoClient = require('../../../../../app/dataServices/mongoClient');
const logger = require('../../../../../app/common/logger');
const dataServiceConstants = require('../../../../../app/dataServices/parameter/constants');
const commonServices = require('../../../../../app/services/common');

describe('updateParameterGroup', () => {
  let updateParameterGroupResStatusSpy;
  let updateParameterGroupResSendSpy;
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateParameterGroupResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    updateParameterGroupResSendSpy = sinon.spy(mockData.responseObj, 'send');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });
  
  it('Checking the flow till mongo db for update parameter group', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    await controllers.updateParameterGroup(mockData.requestobj.updateParameterGroup, mockData.responseObj);
    expect(updateParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(updateParameterGroupResSendSpy.firstCall.args[0].result).to.eql({ ok: true });
  });

  it('should throw error if updateOne from mongo Db throw error', async () => {
    sinon.stub(logger, 'error');
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    await controllers.updateParameterGroup(mockData.requestobj.updateParameterGroup, mockData.responseObj);
    expect(updateParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(updateParameterGroupResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.group.update.error });
  });
});
describe('getParameters', () => {
  let getParametersResStatusSpy;
  let getParametersResSendSpy;
  let aggregateMongoClientStub;

  beforeEach(() => {
    getParametersResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    getParametersResSendSpy = sinon.spy(mockData.responseObj, 'send');
    aggregateMongoClientStub = sinon.stub(mongoClient, 'aggregate');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should get all the parameter from mongo db and checking the flow', async () => {
    const getParametersAggregationPipelinedataServiceConstantsSpy = sinon.spy(dataServiceConstants, 'getParametersAggregatePipeline');
    aggregateMongoClientStub = aggregateMongoClientStub.returns(mockData.mongoClientResult.getParameters);
    await controllers.getParameters(mockData.requestobj.getParameters, mockData.responseObj);
    expect(aggregateMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(aggregateMongoClientStub.getCall(0).args[1]).to.deep.equal(getParametersAggregationPipelinedataServiceConstantsSpy.returnValues[0]);
    expect(getParametersResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(getParametersResSendSpy.firstCall.args[0].result).to.deep.equal(mockData.mongoClientResult.getParameters);
  });

  it('should throw error if mongo db throws error', async () => {
    sinon.stub(logger, 'error');
    const error = new Error('mongo database');
    aggregateMongoClientStub = aggregateMongoClientStub.throws(error);
    await controllers.getParameters(mockData.requestobj.getParameters, mockData.responseObj);
    expect(getParametersResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(getParametersResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.get.error });
  });
});

describe('createParameterGroup', () => {
  let createParameterGroupResStatusSpy;
  let createParameterGroupResSendSpy;
  let insertOneMongoClientStub;
  let updateOneMongoClientStub;

  beforeEach(() => {
    createParameterGroupResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    createParameterGroupResSendSpy = sinon.spy(mockData.responseObj, 'send');
    insertOneMongoClientStub = sinon.stub(mongoClient, 'insertOne');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('Checking the flow till mongo db for create Parameter Group', () => {
    beforeEach(() => {

      insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.mongoClientResult.insertOne);
    });

    it('checking the status and code if successful', async () => {
      await controllers.createParameterGroup(mockData.requestobj.createParameterGroup, mockData.responseObj);
      expect(createParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.successfulCreate);
      expect(createParameterGroupResSendSpy.firstCall.args[0].result.id).to.deep.equal(mockData.mongoClientResult.insertOne.insertedId);
    });

    it('checking the argument for mongo db statement', async () => {
      await controllers.createParameterGroup(mockData.requestobj.createParameterGroup, mockData.responseObj);
      expect(insertOneMongoClientStub.getCall(0).args[0]).to.equal(mockData.mongoClientParameter.createParameterGroup.insertOne[0]);
      expect(insertOneMongoClientStub.getCall(0).args[1]).to.deep.include(mockData.mongoClientParameter.createParameterGroup.insertOne[1]);
      expect(insertOneMongoClientStub.getCall(0).args[1]).to.have.property('createdAt').to.be.instanceOf(Date);
      expect(insertOneMongoClientStub.getCall(0).args[1]).to.have.property('updatedAt').to.be.instanceOf(Date);
      expect(updateOneMongoClientStub.getCall(0).args).to.deep.equal(mockData.mongoClientParameter.createParameterGroup.updateOne);
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
      await controllers.createParameterGroup(mockData.requestobj.createParameterGroup, mockData.responseObj);
      expect(createParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(createParameterGroupResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.group.create.error });
    });

    it('should throw error if updateOne from mongo Db throw error', async () => {
      updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
      await controllers.createParameterGroup(mockData.requestobj.createParameterGroup, mockData.responseObj);
      expect(createParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(createParameterGroupResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.group.create.error });
    });
  });
});

describe('moveParameterGroup', () => {
  let moveParameterGroupResStatusSpy;
  let moveParameterGroupResSendSpy;
  let updateOneMongoClientStub;

  beforeEach(() => {
    moveParameterGroupResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    moveParameterGroupResSendSpy = sinon.spy(mockData.responseObj, 'send');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should move the parameter group and checking the flow', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    await controllers.moveParameterGroup(mockData.requestobj.moveParameterGroup, mockData.responseObj);
    expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.moveParameterGroup[0]);
    expect(updateOneMongoClientStub.getCall(1).args).to.eql(mockData.mongoClientParameter.moveParameterGroup[1]);
    expect(moveParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
    expect(moveParameterGroupResSendSpy.firstCall.args[0].result).to.eql({ ok: true });
  });

  it('should throw error if mongo db throws error', async () => {
    sinon.stub(logger, 'error');
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    await controllers.moveParameterGroup(mockData.requestobj.moveParameterGroup, mockData.responseObj);
    expect(moveParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(moveParameterGroupResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.group.move.error });
  });
});

describe('createParameter', () => {
  let createParameterResStatusSpy;
  let createParameterResSendSpy;
  let insertOneMongoClientStub;
  let updateOneMongoClientStub;

  beforeEach(() => {
    createParameterResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    createParameterResSendSpy = sinon.spy(mockData.responseObj, 'send');
    insertOneMongoClientStub = sinon.stub(mongoClient, 'insertOne');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
    sinon.stub(commonServices.global, 'getParameterType').returns(mockData.commonServiceResult.getParameterType);
  });
  afterEach(() => {
    sinon.restore();
  });
    
  describe('Checking the flow till mongo db for create Parameter Group', () => {
    beforeEach(() => {
      insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.mongoClientResult.insertOne);
    });

    it('checking the status and code', async () => {
      await controllers.createParameter(mockData.requestobj.createParameter, mockData.responseObj);
      expect(createParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.successfulCreate);
      expect(createParameterResSendSpy.firstCall.args[0].result.id).to.deep.equal(mockData.mongoClientResult.insertOne.insertedId);
    });

    it('checking the argument for mongo db statement', async () => {
      await controllers.createParameter(mockData.requestobj.createParameter, mockData.responseObj);
      console.log(insertOneMongoClientStub.getCall(0).args);
      expect(insertOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.parameter);
      expect(insertOneMongoClientStub.getCall(0).args[1]).to.have.all.keys(mockData.properties.createParameter[0]);
      expect(updateOneMongoClientStub.getCall(0).args).to.deep.equal(mockData.mongoClientParameter.createParameter.updateOne);
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
      await controllers.createParameter(mockData.requestobj.createParameter, mockData.responseObj);
      expect(createParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(createParameterResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.create.error });
    });

    it('should throw error if updateOne from mongo Db throw error', async () => {
      updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
      await controllers.createParameter(mockData.requestobj.createParameter, mockData.responseObj);
      expect(createParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(createParameterResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.create.error });
    });
  });
});

describe('deleteParameterGroup', () => {
  let deleteParameterGroupResStatusSpy;
  let deleteParameterGroupResSendSpy;
  let deleteOneMongoClientStub;
  let updateOneMongoClientStub;
  let deleteManyMongoClientStub;
  let updateManyMongoClientStub;
  let findOneAndDeleteMongoClientStub;

  beforeEach(() => {
    deleteParameterGroupResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    deleteParameterGroupResSendSpy = sinon.spy(mockData.responseObj, 'send');
    deleteOneMongoClientStub = sinon.stub(mongoClient, 'deleteOne');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
    deleteManyMongoClientStub = sinon.stub(mongoClient, 'deleteMany');
    updateManyMongoClientStub = sinon.stub(mongoClient, 'updateMany');
    findOneAndDeleteMongoClientStub = sinon.stub(mongoClient, 'findOneAndDelete');
  });
  afterEach(() => {
    sinon.restore();
  });

  
  describe('Checking the flow till mongo db for deleteParmeter if parameterGroup moved to Id is given', () => {
    beforeEach(() => {
      updateManyMongoClientStub = updateManyMongoClientStub.returns(mockData.mongoClientResult.updateMany);
      findOneAndDeleteMongoClientStub = findOneAndDeleteMongoClientStub.returns(mockData.mongoClientResult.findOneAndDelete);
    });

    it('checking the status and code', async () => {
      await controllers.deleteParameterGroup(mockData.requestobj.deleteParameterGroup[0], mockData.responseObj);
      expect(deleteOneMongoClientStub.calledOnce).to.be.false;
      expect(deleteManyMongoClientStub.calledOnce).to.be.false;
      expect(deleteParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
      expect(deleteParameterGroupResSendSpy.firstCall.args[0].result).to.deep.equal({ ok: true });
    });

    it('checking the argument for mongo db statement', async () => {
      await controllers.deleteParameterGroup(mockData.requestobj.deleteParameterGroup[0], mockData.responseObj);
      expect(findOneAndDeleteMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteParameterGroup.findOneAndDelete);
      expect(updateManyMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteParameterGroup.updateMany);
      expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteParameterGroup.updateOne.application);
      expect(updateOneMongoClientStub.getCall(1).args).to.eql(mockData.mongoClientParameter.deleteParameterGroup.updateOne.parameter);
    });
  });

  describe('Checking the flow till mongo db for deleteParmeter if parameterGroup moved to Id is not given', () => {
    beforeEach(() => {
      deleteManyMongoClientStub = deleteManyMongoClientStub.returns(mockData.mongoClientResult.delete);
    });

    it('checking the status and code', async () => {
      await controllers.deleteParameterGroup(mockData.requestobj.deleteParameterGroup[1], mockData.responseObj);
      expect(updateManyMongoClientStub.calledOnce).to.be.false;
      expect(deleteParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
      expect(deleteParameterGroupResSendSpy.firstCall.args[0].result).to.deep.equal({ ok: true });
    });

    it('checking the argument for mongo db statement', async () => {
      await controllers.deleteParameterGroup(mockData.requestobj.deleteParameterGroup[1], mockData.responseObj);
      expect(deleteManyMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteParameterGroup.deleteMany);
      expect(deleteOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteParameterGroup.deleteOne);
      expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteParameterGroup.updateOne.application);
    });
  });

  describe('Throwing error from mongo db', () => {
    let error;

    beforeEach(() => {
      sinon.stub(logger, 'error');
      error = new Error('mongo database');
    });

   
    it('should throw error if mongo db updateOne throw error', async () => {
      updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
      await controllers.deleteParameterGroup(mockData.requestobj.deleteParameterGroup[0], mockData.responseObj);
      expect(deleteParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(deleteParameterGroupResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.group.delete.error });
    });

    it('should throw error if mongo db findOneAndDelete throw error', async () => {
      findOneAndDeleteMongoClientStub = findOneAndDeleteMongoClientStub.throws(error);
      await controllers.deleteParameterGroup(mockData.requestobj.deleteParameterGroup[0], mockData.responseObj);
      expect(deleteParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(deleteParameterGroupResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.group.delete.error });
    });

    it('should throw error if mongo db updateMany throw error', async () => {
      findOneAndDeleteMongoClientStub = findOneAndDeleteMongoClientStub.returns(mockData.mongoClientResult.findOneAndDelete);
      updateManyMongoClientStub = updateManyMongoClientStub.throws(error);
      await controllers.deleteParameterGroup(mockData.requestobj.deleteParameterGroup[0], mockData.responseObj);
      expect(deleteParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(deleteParameterGroupResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.group.delete.error });
    });

    it('should throw error if mongo db deleteOne throw error', async () => {
      deleteManyMongoClientStub = deleteManyMongoClientStub.throws(error);
      await controllers.deleteParameterGroup(mockData.requestobj.deleteParameterGroup[1], mockData.responseObj);
      expect(deleteParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(deleteParameterGroupResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.group.delete.error });
    });

    it('should throw error if mongo db deleteMany throw error', async () => {
      deleteOneMongoClientStub = deleteOneMongoClientStub.throws(error);
      await controllers.deleteParameterGroup(mockData.requestobj.deleteParameterGroup[1], mockData.responseObj);
      expect(deleteParameterGroupResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(deleteParameterGroupResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.group.delete.error });
    });
  });
});

describe('deleteParameters', () => {
  let deleteParametersResStatusSpy;
  let deleteParametersResSendSpy;
  let deleteManyMongoClientStub;
  let updateManyMongoClientStub;

  beforeEach(() => {
    deleteParametersResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    deleteParametersResSendSpy = sinon.spy(mockData.responseObj, 'send');
    deleteManyMongoClientStub = sinon.stub(mongoClient, 'deleteMany');
    updateManyMongoClientStub = sinon.stub(mongoClient, 'updateMany');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('Checking the flow till mongo db for create Parameters', () => {
    beforeEach(() => {
      deleteManyMongoClientStub = deleteManyMongoClientStub.returns(mockData.mongoClientResult.delete);
    });

    it('checking the status and code', async () => {
      await controllers.deleteParameters(mockData.requestobj.deleteParameter, mockData.responseObj);
      expect(deleteParametersResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
      expect(deleteParametersResSendSpy.firstCall.args[0].result).to.deep.equal({ ok: true });
    });

    it('checking the argument for mongo db statement', async () => {
      await controllers.deleteParameters(mockData.requestobj.deleteParameter, mockData.responseObj);
      expect(deleteManyMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteParameters.deleteMany);
      expect(updateManyMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.deleteParameters.updateMany);
    });
  });

  describe('Throwing error from mongo db', () => {
    let error;

    beforeEach(() => {
      sinon.stub(logger, 'error');
      error = new Error('mongo database');
    });

    it('should throw error if deleteMany from mongo Db throw error', async () => {
      deleteManyMongoClientStub = deleteManyMongoClientStub.throws(error);
      await controllers.deleteParameters(mockData.requestobj.deleteParameter, mockData.responseObj);
      expect(deleteParametersResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(deleteParametersResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.delete.error });
    });

    it('should throw error if updateMany from mongo Db throw error', async () => {
      updateManyMongoClientStub = updateManyMongoClientStub.throws(error);
      await controllers.deleteParameters(mockData.requestobj.deleteParameter, mockData.responseObj);
      expect(deleteParametersResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(deleteParametersResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.delete.error });
    });
  });
});

describe('moveParameters', () => {
  let moveParametersResStatusSpy;
  let moveParametersResSendSpy;
  let updateManyMongoClientStub;
  let updateOneMongoClientStub;

  beforeEach(() => {
    moveParametersResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    moveParametersResSendSpy = sinon.spy(mockData.responseObj, 'send');
    updateManyMongoClientStub = sinon.stub(mongoClient, 'updateMany');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('Checking the flow till mongo db for create Parameter Group', () => {
    beforeEach(() => {
      updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    });

    it('checking the status and code', async () => {
      await controllers.moveParameters(mockData.requestobj.moveParameters, mockData.responseObj);
      expect(moveParametersResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
      expect(moveParametersResSendSpy.firstCall.args[0].result).to.eql({ ok: true });
    });

    it('checking the argument for mongo db statement', async () => {
      await controllers.moveParameters(mockData.requestobj.moveParameters, mockData.responseObj);
      expect(updateOneMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.moveParameters.updateOne);
      expect(updateManyMongoClientStub.getCall(0).args).to.eql(mockData.mongoClientParameter.moveParameters.updateMany);
    });
  });

  describe('Throwing error from mongo db', () => {
    let error;

    beforeEach(() => {
      sinon.stub(logger, 'error');
      error = new Error('mongo database');
    });
    it('should throw error if updateMany from mongo Db throw error', async () => {
      updateManyMongoClientStub = updateManyMongoClientStub.throws(error);
      await controllers.moveParameters(mockData.requestobj.moveParameters, mockData.responseObj);
      expect(moveParametersResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(moveParametersResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.move.error });
    });

    it('should throw error if updateOne from mongo Db throw error', async () => {
      updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
      await controllers.moveParameters(mockData.requestobj.moveParameters, mockData.responseObj);
      expect(moveParametersResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
      expect(moveParametersResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.move.error });
    });
  });
});

describe('updateParameter', () => {
  let updateParameterResStatusSpy;
  let updateParameterResSendSpy;
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateParameterResStatusSpy = sinon.spy(mockData.responseObj, 'status');
    updateParameterResSendSpy = sinon.spy(mockData.responseObj, 'send');
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
    sinon.stub(commonServices.global, 'getParameterType').returns(mockData.commonServiceResult.getParameterType);
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('Checking the flow till mongo db for update Parameter', () => {
    beforeEach(() => {
      updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.mongoClientResult.updateOne);
    });

    it('checking the status and code', async () => {
      await controllers.updateParameter(mockData.requestobj.updateParameter, mockData.responseObj);
      expect(updateParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.success);
      expect(updateParameterResSendSpy.firstCall.args[0].result).to.eql({ ok: true });
    });

    it('checking the argument for mongo db statement', async () => {
      await controllers.updateParameter(mockData.requestobj.updateParameter, mockData.responseObj);
      console.log(updateOneMongoClientStub.getCall(0).args);
      expect(updateOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.parameter);
      expect(updateOneMongoClientStub.getCall(0).args[1]).to.eql({ _id: mongoClient.getObjectId(mockData.requestobj.updateParameter.params.parameterId) });
      expect(updateOneMongoClientStub.getCall(0).args[2].$set).to.have.all.keys(mockData.properties.updateParameter[0]);
      expect(updateOneMongoClientStub.getCall(0).args[2].$set.specificProperties).to.have.all.keys(mockData.properties.updateParameter[1]);
    });
  });

  it('should throw error if updateOne from mongo Db throw error', async () => {
    sinon.stub(logger, 'error');
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    await controllers.updateParameter(mockData.requestobj.updateParameter, mockData.responseObj);
    expect(updateParameterResStatusSpy.firstCall.args[0]).to.equal(constants.httpCodes.internalServerError);
    expect(updateParameterResSendSpy.firstCall.args[0]).to.deep.equal({ message: constants.parameter.update.error });
  });
});
