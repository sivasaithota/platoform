const constants = require('../../../../../../app/common/constants');

const mockData = {
  responseObj: {
    status:(code) => {
      return mockData.responseObj;
    },
    send: (result) => {
    },
  },
  requestObj: {
    validRequest: {
      params: {
        type: 'application',
      },
      query: {
        parameterId: '123456789012345678901234',
        name: 'test',
      },
    },
    inValidArgment: {
      inValidtype: {
        params: {
          type: 'test',
        },
      },
    },
  },
  sendError: {
    getCheckUnique: [{
      invalidParams: { type: 'No such type found' },
      message: constants.global.checkUnique.paramsInvalid,
    }],
  },
};
module.exports = mockData;
