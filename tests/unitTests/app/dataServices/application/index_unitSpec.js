const sinon = require('sinon');
const { expect } = require('../../../base');
const mockData = require('./mockData');
const applicationDataService = require('../../../../../app/dataServices/application');
const mongoClient = require('../../../../../app/dataServices/mongoClient');
const constants = require('../../../../../app/common/constants');
const pgClient = require('../../../../../app/dataServices/pgClient');

describe('getApplicationData', () => {
  let findOneMongoClientStub;
  beforeEach(() => {
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    findOneMongoClientStub.restore();
  });

  it('should check whether findOne is called and checking the argument', async () => {
    await applicationDataService.getApplicationData(mockData.appId);
    expect(findOneMongoClientStub.calledOnce).to.be.true;
    expect(findOneMongoClientStub.getCall(0).args[0]).to.equal('applications');
    const appObjectId = mongoClient.getObjectId(mockData.appId);
    expect(findOneMongoClientStub.getCall(0).args[1]).to.deep.equal({ _id: appObjectId });
  });

  it('should retrieve the app details from findOne Mongo client', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns(mockData.result.findOne);
    const result = await applicationDataService.getApplicationData(mockData.appId);
    expect(result).to.equal(mockData.result.findOne);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findOneMongoClientStub = findOneMongoClientStub.throws(error);
    try {
      await applicationDataService.getApplicationData(mockData.appId);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('deleteAllApplicationData', () => {
  let deleteManyMongoClientStub;
  beforeEach(() => {
    deleteManyMongoClientStub = sinon.stub(mongoClient, 'deleteMany');
  });
  afterEach(() => {
    deleteManyMongoClientStub.restore();
  });

  it('should check deleteMany is called (count)', async () => {
    const result = await applicationDataService.deleteAllApplicationData(mockData.appId);
    expect(result.length).to.eql(7);
  });

  it('checking the argument for deleteMany', async () => {
    await applicationDataService.deleteAllApplicationData(mockData.appId);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 7; i++) {
      expect(deleteManyMongoClientStub.getCall(i).args).to.eql(mockData.result.deleteAllApplicationData[i]);
    }
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    deleteManyMongoClientStub = deleteManyMongoClientStub.throws(error);
    try {
      await applicationDataService.getApplicationData(mockData.appId);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('deleteApplicationDatabase', () => {
  let executeQueryStub;

  beforeEach(() => {
    executeQueryStub = sinon.stub(pgClient, 'executeQuery');
  });
  afterEach(() => {
    sinon.restore();
  });
  it('should check execute query is called with rigth argument', async () => {
    const result = await applicationDataService.deleteApplicationDatabase('test');
    expect(executeQueryStub.calledOnce).to.be.true;
    expect(executeQueryStub.getCall(0).args[0]).to.equal(mockData.databaseQuery.deleteApplicationDatabase);
    expect(result).to.equal(undefined);
  });
  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    executeQueryStub = executeQueryStub.throws(error);
    try {
      await applicationDataService.deleteApplicationDatabase('test');
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getAppIdByUrl', () => {
  let findOneMongoClientStub;
  beforeEach(() => {
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    findOneMongoClientStub.restore();
  });

  it('should check whether findOne is called and checking the argument', async () => {
    await applicationDataService.getAppIdByUrl(mockData.url);
    expect(findOneMongoClientStub.calledOnce).to.be.true;
    expect(findOneMongoClientStub.getCall(0).args[0]).to.equal('applications');
    expect(findOneMongoClientStub.getCall(0).args[1]).to.deep.equal({ url: 'test/' });
    expect(findOneMongoClientStub.getCall(0).args[2]).to.deep.equal({ _id: 1 });
  });

  it('should retrieve the app details from findOne Mongo client', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns(mockData.result.findOne);
    const result = await applicationDataService.getAppIdByUrl(mockData.appId);
    expect(result).to.equal(mockData.result.findOne);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findOneMongoClientStub = findOneMongoClientStub.throws(error);
    try {
      await applicationDataService.getAppIdByUrl(mockData.appId);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getAppIdByScriptName', () => {
  let findOneMongoClientStub;

  beforeEach(() => {
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    findOneMongoClientStub.restore();
  });

  it('should check whether findOne is called and checking the argument', async () => {
    await applicationDataService.getAppIdByScriptName(mockData.appId, mockData.fileName);
    expect(findOneMongoClientStub.calledOnce).to.be.true;
    expect(findOneMongoClientStub.getCall(0).args[0]).to.equal('applications');
    const appObjectId = mongoClient.getObjectId(mockData.appId);
    expect(findOneMongoClientStub.getCall(0).args[1]).to.deep.equal({ _id: appObjectId, scripts: 'test' });
  });

  it('should retrieve the app details from findOne Mongo client', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns(mockData.result.findOne);
    const result = await applicationDataService.getApplicationData(mockData.appId, mockData.fileName);
    expect(result).to.equal(mockData.result.findOne);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findOneMongoClientStub = findOneMongoClientStub.throws(error);
    try {
      await applicationDataService.getApplicationData(mockData.appId, mockData.fileName);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getAppByName', () => {
  let findOneMongoClientStub;
  beforeEach(() => {
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    findOneMongoClientStub.restore();
  });

  it('should check whether findOne is called and checking the argument', async () => {
    await applicationDataService.getAppByName(mockData.appName);
    expect(findOneMongoClientStub.calledOnce).to.be.true;
    expect(findOneMongoClientStub.getCall(0).args[0]).to.equal('applications');
    expect(findOneMongoClientStub.getCall(0).args[1]).to.deep.equal({ name: 'test' });
  });

  it('should retrieve the app details from findOne Mongo client', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns(mockData.result.findOne);
    const result = await applicationDataService.getAppByName(mockData.appName);
    expect(result).to.equal(mockData.result.findOne);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findOneMongoClientStub = findOneMongoClientStub.throws(error);
    try {
      await applicationDataService.getAppByName(mockData.appName);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getTagByName', () => {
  let findOneMongoClientStub;
  beforeEach(() => {
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    findOneMongoClientStub.restore();
  });

  it('should check whether findOne is called and checking the argument', async () => {
    await applicationDataService.getTagByName(mockData.appId, mockData.tagName);
    expect(findOneMongoClientStub.calledOnce).to.be.true;
    expect(findOneMongoClientStub.getCall(0).args[0]).to.equal('tags');
    const appObjectId = mongoClient.getObjectId(mockData.appId);
    expect(findOneMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.query.getTagByName);
  });

  it('should retrieve the app details from findOne Mongo client', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns(mockData.result.findOne);
    const result = await applicationDataService.getTagByName(mockData.appId, mockData.tagName);
    expect(result).to.equal(mockData.result.findOne);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findOneMongoClientStub = findOneMongoClientStub.throws(error);
    try {
      await applicationDataService.getTagByName(mockData.appId, mockData.tagName);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getTag', () => {
  let findOneMongoClientStub;
  beforeEach(() => {
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    findOneMongoClientStub.restore();
  });

  it('should check whether findOne is called and checking the argument', async () => {
    await applicationDataService.getTag(mockData.appId, mockData.parameter.getTag);
    expect(findOneMongoClientStub.calledOnce).to.be.true;
    expect(findOneMongoClientStub.getCall(0).args[0]).to.equal('tags');
    expect(findOneMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.query.getTag);
  });

  it('should retrieve the app details from findOne Mongo client', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns(mockData.result.findOne);
    const result = await applicationDataService.getTag(mockData.appId, mockData.parameter.getTag);
    expect(result).to.equal(mockData.result.findOne);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findOneMongoClientStub = findOneMongoClientStub.throws(error);
    try {
      await applicationDataService.getTag(mockData.appId, mockData.parameter.getTag);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getAppIdByActionId', () => {
  let findOneMongoClientStub;

  beforeEach(() => {
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    findOneMongoClientStub.restore();
  });

  it('should check whether findOne is called and checking the argument', async () => {
    await applicationDataService.getAppIdByActionId(mockData.appId);
    expect(findOneMongoClientStub.calledOnce).to.be.true;
    expect(findOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.action);
    const appObjectId = mongoClient.getObjectId(mockData.appId);
    expect(findOneMongoClientStub.getCall(0).args[1]).to.deep.equal({ _id: appObjectId });
    expect(findOneMongoClientStub.getCall(0).args[2]).to.deep.equal({ appId: 1 });
  });

  it('should retrieve the app details from findOne Mongo client', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns(mockData.result.findOne);
    const result = await applicationDataService.getAppIdByActionId(mockData.appId);
    expect(result).to.equal(mockData.result.findOne);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findOneMongoClientStub = findOneMongoClientStub.throws(error);
    try {
      await applicationDataService.getAppIdByActionId(mockData.appId);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getActionAppIdByFileName', () => {
  let findOneMongoClientStub;

  beforeEach(() => {
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    findOneMongoClientStub.restore();
  });

  it('should check whether findOne is called and checking the argument', async () => {
    await applicationDataService.getActionAppIdByFileName(mockData.appId, mockData.fileName);
    expect(findOneMongoClientStub.calledOnce).to.be.true;
    expect(findOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.action);
    expect(findOneMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.query.getActionAppIdByFileName);
    expect(findOneMongoClientStub.getCall(0).args[2]).to.deep.equal({ appId: 1 });
  });

  it('should retrieve the app details from findOne Mongo client', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns(mockData.result.findOne);
    const result = await applicationDataService.getActionAppIdByFileName(mockData.appId, mockData.fileName);
    expect(result).to.equal(mockData.result.findOne);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findOneMongoClientStub = findOneMongoClientStub.throws(error);
    try {
      await applicationDataService.getActionAppIdByFileName(mockData.appId, mockData.fileName);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});

describe('getApplications', () => {
  let findMongoClientStub;

  beforeEach(() => {
    findMongoClientStub = sinon.stub(mongoClient, 'find');
  });
  afterEach(() => {
    findMongoClientStub.restore();
  });
  it('should retrieve the list of apps through find Mongo client', async () => {
    findMongoClientStub = findMongoClientStub.returns(mockData.result.getApplications);
    const result = await applicationDataService.getApplications(mockData.parameter.getApplications[1]);
    expect(result).to.equal(mockData.result.getApplications);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findMongoClientStub = findMongoClientStub.throws(error);
    try {
      await applicationDataService.getApplications(mockData.parameter.getApplications[0]);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should check whether find is called and checking the argument', async () => {
    await applicationDataService.getApplications(mockData.parameter.getApplications[0]);
    expect(findMongoClientStub.calledOnce).to.be.true;
    expect(findMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(findMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.query.getApplications);
    expect(findMongoClientStub.getCall(0).args[2]).to.deep.equal(mockData.projection.getApplications);
    expect(findMongoClientStub.getCall(0).args[3]).to.deep.equal(mockData.sort.getApplications);
    expect(findMongoClientStub.getCall(0).args[4]).to.equal(2);
    expect(findMongoClientStub.getCall(0).args[4]).to.equal(2);
  });
  it('should check whether find is called and checking the argument without sortBy in argument', async () => {
    await applicationDataService.getApplications(mockData.parameter.getApplications[1]);
    expect(findMongoClientStub.calledOnce).to.be.true;
    expect(findMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(findMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.query.getApplications);
    expect(findMongoClientStub.getCall(0).args[2]).to.deep.equal(mockData.projection.getApplications);
    expect(findMongoClientStub.getCall(0).args[3]).to.deep.equal(mockData.sort.getApplications);
    expect(findMongoClientStub.getCall(0).args[4]).to.equal(2);
    expect(findMongoClientStub.getCall(0).args[4]).to.equal(2);
  });
});

describe('getApplication', () => {
  let findOneMongoClientStub;

  beforeEach(() => {
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    findOneMongoClientStub.restore();
  });
  it('should retrieve the particular application based on application Id from Mongo client', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns(mockData.result.getApplication);
    const result = await applicationDataService.getApplication(mockData.appId);
    expect(result).to.equal(mockData.result.getApplication);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findOneMongoClientStub = findOneMongoClientStub.throws(error);
    try {
      await applicationDataService.getApplication(mockData.appId);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should check whether find is called and checking the argument', async () => {
    await applicationDataService.getApplication(mockData.appId);
    expect(findOneMongoClientStub.calledOnce).to.be.true;
    const appObjectId = mongoClient.getObjectId(mockData.appId);
    expect(findOneMongoClientStub.getCall(0).args[1]).to.deep.equal({ _id: appObjectId });
    expect(findOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(findOneMongoClientStub.getCall(0).args[2]).to.deep.equal(mockData.projection.getApplication);
  });
});
describe('createApplication', () => {
  let insertOneMongoClientStub;

  beforeEach(() => {
    insertOneMongoClientStub = sinon.stub(mongoClient, 'insertOne');
  });
  afterEach(() => {
    insertOneMongoClientStub.restore();
  });
  it('should retrieve the list of apps through find Mongo client', async () => {
    insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.result.createApplication);
    const result = await applicationDataService.createApplication(mockData.parameter.createApplication);
    expect(result).to.equal(mockData.result.createApplication);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    insertOneMongoClientStub = insertOneMongoClientStub.throws(error);
    try {
      await applicationDataService.createApplication(mockData.parameter.createApplication);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should check whether find is called and checking the argument', async () => {
    await applicationDataService.createApplication(mockData.parameter.createApplication);
    expect(insertOneMongoClientStub.calledOnce).to.be.true;
    expect(insertOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(insertOneMongoClientStub.getCall(0).args[1]).to.have.all.keys(mockData.properties.createApplication);
  });
});

describe('getTags', () => {
  let distinctMongoClientStub;

  beforeEach(() => {
    distinctMongoClientStub = sinon.stub(mongoClient, 'distinct');
  });
  afterEach(() => {
    distinctMongoClientStub.restore();
  });
  it('should retrieve the particular application based on application Id from Mongo client', async () => {
    distinctMongoClientStub = distinctMongoClientStub.returns(mockData.result.getTags);
    const result = await applicationDataService.getTags(mockData.appId);
    expect(result).to.equal(mockData.result.getTags);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    distinctMongoClientStub = distinctMongoClientStub.throws(error);
    try {
      await applicationDataService.getTags(mockData.appId);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should check whether find is called and checking the argument', async () => {
    await applicationDataService.getTags(mockData.appId);
    expect(distinctMongoClientStub.calledOnce).to.be.true;
    const appObjectId = mongoClient.getObjectId(mockData.appId);
    expect(distinctMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.table);
    expect(distinctMongoClientStub.getCall(0).args[1]).to.deep.equal('tag');
    expect(distinctMongoClientStub.getCall(0).args[2]).to.deep.equal({ appId: appObjectId });
  });
});

describe('getScripts', () => {
  let findOneMongoClientStub;

  beforeEach(() => {
    findOneMongoClientStub = sinon.stub(mongoClient, 'findOne');
  });
  afterEach(() => {
    findOneMongoClientStub.restore();
  });
  it('should retrieve the particular application based on application Id from Mongo client', async () => {
    findOneMongoClientStub = findOneMongoClientStub.returns(mockData.result.getScripts);
    const result = await applicationDataService.getScripts(mockData.appId);
    expect(result).to.equal(mockData.result.getScripts);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findOneMongoClientStub = findOneMongoClientStub.throws(error);
    try {
      await applicationDataService.getScripts(mockData.appId);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should check whether find is called and checking the argument', async () => {
    await applicationDataService.getScripts(mockData.appId);
    expect(findOneMongoClientStub.calledOnce).to.be.true;
    const appObjectId = mongoClient.getObjectId(mockData.appId);
    expect(findOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(findOneMongoClientStub.getCall(0).args[2]).to.deep.equal(mockData.projection.getScripts);
    expect(findOneMongoClientStub.getCall(0).args[1]).to.deep.equal({ _id: appObjectId });
  });
});

describe('getActions', () => {
  let findMongoClientStub;

  beforeEach(() => {
    findMongoClientStub = sinon.stub(mongoClient, 'find');
  });
  afterEach(() => {
    findMongoClientStub.restore();
  });
  it('should retrieve the particular application based on application Id from Mongo client', async () => {
    findMongoClientStub = findMongoClientStub.returns(mockData.result.getActions);
    const result = await applicationDataService.getActions(mockData.appId);
    expect(result).to.equal(mockData.result.getActions);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    findMongoClientStub = findMongoClientStub.throws(error);
    try {
      await applicationDataService.getActions(mockData.appId);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should check whether find is called and checking the argument', async () => {
    await applicationDataService.getActions(mockData.appId);
    expect(findMongoClientStub.calledOnce).to.be.true;
    const appObjectId = mongoClient.getObjectId(mockData.appId);
    expect(findMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.action);
    expect(findMongoClientStub.getCall(0).args[2]).to.deep.equal(mockData.projection.getActions);
    expect(findMongoClientStub.getCall(0).args[1]).to.deep.equal({ appId: appObjectId });
  });
});

describe('createActions', () => {
  let insertOneMongoClientStub;

  beforeEach(() => {
    insertOneMongoClientStub = sinon.stub(mongoClient, 'insertOne');
  });
  afterEach(() => {
    insertOneMongoClientStub.restore();
  });
  it('should craete action through findOne Mongo client', async () => {
    insertOneMongoClientStub = insertOneMongoClientStub.returns(mockData.result.createActions);
    const result = await applicationDataService.createAction(mockData.parameter.createActions);
    expect(result).to.equal(mockData.result.createActions);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    insertOneMongoClientStub = insertOneMongoClientStub.throws(error);
    try {
      await applicationDataService.createAction(mockData.parameter.createActions);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should check whether find is called and checking the argument', async () => {
    await applicationDataService.createAction(mockData.parameter.createActions);
    expect(insertOneMongoClientStub.calledOnce).to.be.true;
    expect(insertOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.action);
    expect(insertOneMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.query.createActions);
  });
});

describe('updateAction', () => {
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    updateOneMongoClientStub.restore();
  });
  it('should upadate action through updateOne Mongo client', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.updateOne);
    const result = await applicationDataService.updateAction(mockData.parameter.updateAction.paramobject, mockData.parameter.updateAction.actionObject);
    expect(result).to.equal(mockData.updateOne);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await applicationDataService.updateAction(mockData.parameter.updateAction.paramobject, mockData.parameter.updateAction.actionObject);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should check whether find is called and checking the argument', async () => {
    await applicationDataService.updateAction(mockData.parameter.updateAction.paramobject, mockData.parameter.updateAction.actionObject);
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(updateOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.action);
    expect(updateOneMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.query.applicationId);
    expect(updateOneMongoClientStub.getCall(0).args[2].$set).to.deep.equal(mockData.update.updateAction);
  });
});

describe('addScript', () => {
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    updateOneMongoClientStub.restore();
  });
  it('should add scripts through updateOne Mongo client', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.updateOne);
    const result = await applicationDataService.addScript(mockData.appId, mockData.fileName);
    expect(result).to.equal(mockData.updateOne);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await applicationDataService.addScript(mockData.appId, mockData.fileName);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should check whether find is called and checking the argument', async () => {
    await applicationDataService.addScript(mockData.appId, mockData.fileName);
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(updateOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(updateOneMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.query.applicationId);
    expect(updateOneMongoClientStub.getCall(0).args[2]).to.deep.equal(mockData.update.addScript);
  });
});

describe('deleteScript', () => {
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    updateOneMongoClientStub.restore();
  });
  it('should add scripts through updateOne Mongo client', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.updateOne);
    const result = await applicationDataService.deleteScript(mockData.appId, mockData.fileName);
    expect(result).to.equal(mockData.updateOne);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await applicationDataService.deleteScript(mockData.appId, mockData.fileName);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should check whether find is called and checking the argument', async () => {
    await applicationDataService.deleteScript(mockData.appId, mockData.fileName);
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(updateOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(updateOneMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.query.applicationId);
    expect(updateOneMongoClientStub.getCall(0).args[2]).to.deep.equal(mockData.update.deleteScript);
  });
});

describe('updateApplication', () => {
  let updateOneMongoClientStub;

  beforeEach(() => {
    updateOneMongoClientStub = sinon.stub(mongoClient, 'updateOne');
  });
  afterEach(() => {
    updateOneMongoClientStub.restore();
  });
  it('should update the application through updateOne Mongo client', async () => {
    updateOneMongoClientStub = updateOneMongoClientStub.returns(mockData.updateOne);
    const result = await applicationDataService.updateApplication(mockData.appId, mockData.parameter.updateApplication);
    expect(result).to.equal(mockData.updateOne);
  });

  it('should throw error if mongo db throw error', async () => {
    const error = new Error('mongo database');
    updateOneMongoClientStub = updateOneMongoClientStub.throws(error);
    try {
      await applicationDataService.updateApplication(mockData.appId, mockData.parameter.updateApplication);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should check whether find is called and checking the argument', async () => {
    await applicationDataService.updateApplication(mockData.appId, mockData.parameter.updateApplication);
    expect(updateOneMongoClientStub.calledOnce).to.be.true;
    expect(updateOneMongoClientStub.getCall(0).args[0]).to.equal(constants.collection.names.application);
    expect(updateOneMongoClientStub.getCall(0).args[1]).to.deep.equal(mockData.query.applicationId);
    expect(updateOneMongoClientStub.getCall(0).args[2]).to.deep.equal(mockData.update.updateApplication);
  });
});