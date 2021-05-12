const sinon = require('sinon');
const path = require('path');
const { expect } = require('../../../base');
const RequestHelper = require('../../../../../app/common/requestHelper');
const mockData = require('./mockData');
const filer = require('../../../../../app/common/filer');
const ticdatGenerator = require('../../../../../app/middleware/parser/ticdatGenerator');

describe('generateTicdatConfig()', () => {
  let deleteDirectoryStub;

  beforeEach(() => {
    sinon.stub(filer, 'createDirectory');
    sinon.stub(filer, 'copyDirectory');
    sinon.stub(filer, 'copyFile');
    deleteDirectoryStub = sinon.stub(filer, 'deleteDirectory');
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should generate config given a ticdat app', async () => {
    sinon.stub(filer, 'readFile').returns(mockData.fileContents.ticdatFile);
    sinon.stub(path, 'basename').returns(mockData.engineFile);
    const makeRequestStub = sinon.stub(RequestHelper.prototype, 'makeRequest').resolves({});
    await ticdatGenerator.generateTicdatConfig(mockData.parameters.engineFilePath);
    expect(makeRequestStub.calledOnce).to.be.true;
    expect(deleteDirectoryStub.calledOnce).to.be.true;
  });

  it('should throw error if given app is ticdat and with invalid ticdat engine file', async () => {
    sinon.stub(filer, 'readFile').returns(mockData.fileContents.ticdatFile);
    sinon.stub(path, 'basename').returns(mockData.engineFile);
    const error = new Error('Throw error');
    const makeRequestStub = sinon.stub(RequestHelper.prototype, 'makeRequest').rejects(error);
    try {
      await ticdatGenerator.generateTicdatConfig(mockData.parameters.engineFilePath);
    } catch (err) {
      expect(makeRequestStub.calledOnce).to.be.true;
      expect(deleteDirectoryStub.calledOnce).to.be.true;
      expect(err).to.equal(error);
    }
  });
});