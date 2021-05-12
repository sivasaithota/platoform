const mongoClient = require('../../../../../../app/dataServices/mongoClient');
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
      createTable: {
        method: 'PATCH',
        params: {
          appId: '123456789012345678901234',
          tableId: '123456789012345678911111',
        },
        query: {
          type: 'input',
        },
        body: {
          position: 1,
          type: 'input',
          fileName: 'test',
          fileData: { path: 'test/' },
          name: 'test',
          tag: { name: 'test', class: 'test' },
          isVisible: true,
          displayName: 'test',
          columns: [{
            name: 'test',
            displayName: 'test',
            datatype: 'text',
          }],
          username: 'test',
        },
      },
      getTables: {
        params: {
          appId: '123456789012345678901234',
          tableId: '123456789012345678911111',
        },
        query: {
          type: 'input',
        },
      },
      moveTable: {
        params: {
          appId: '123456789012345678901234',
          tableId: '123456789012345678911111',
        },
        body: { position: 1 },
      },
      deleteTable: {
        params: {
          appId: '123456789012345678901234',
          tableId: '123456789012345678911111',
        },
      },
      updateTable: {
        method: 'PATCH',
        params: {
          appId: '123456789012345678901234',
          tableId: '123456789012345678911111',
        },
        query: {
          type: 'input',
        },
        body: {
          position: 1,
          type: 'input',
          fileName: 'test',
          fileData: { path: 'test/' },
          name: 'test',
          tag: { name: 'test', class: 'test' },
          isVisible: true,
          displayName: 'test',
          columns: [{
            name: 'test',
            displayName: 'test',
            datatype: 'text',
          }],
          username: 'test',
        },
      },
      getColumns: {
        params: {
          appId: '123456789012345678901234',
          tableId: '123456789012345678911111',
        },
      },
      moveColumn: {
        params: {
          appId: '123456789012345678901234',
          tableId: '123456789012345678911111',
        },
        body: { position: 1 },
      },
      deleteColumn: {
        params: {
          appId: '123456789012345678901234',
          tableId: '123456789012345678911111',
          columnId: '123456789012345678900000',
        },
      },
      updateColumn: {
        params: {
          appId: '123456789012345678901234',
          tableId: '123456789012345678911111',
          columnId: '123456789012345678900000',
        },
        body: {
          name: 'extra',
          displayName: 'Extra',
          datatype: 'numeric',
          scale: 3,
          precision: 1,
          isVisible: true,
          hasQuickFilter: false,
          isEditable: true,
        },
        user: {
          username: 'test',
        },
      },
      createColumn: {
        params: {
          appId: '123456789012345678901234',
          tableId: '123456789012345678911111',
          columnId: '123456789012345678900000',
        },
        body: {
          name: 'extra',
          displayName: 'Extra',
          datatype: 'numeric',
          scale: 3,
          precision: 1,
          isVisible: true,
          hasQuickFilter: false,
          isEditable: true,
        },
        user: {
          username: 'test',
        },
      },
    },
    validNoDataType: {
      params: {
        tableId: '123456789012345678911111',
        columnId: '123456789012345678900000',
      },
      body: {
        name: 'extra',
      },
    },
    inValidArgment: {
      inValidApplicationId: {
        params: {
          appId: 1,
        },
      },
      inValidTableId: {
        params: {
          appId: '123456789012345678901234',
          tableId: '2',
        },
      },
      inValidQueryType: {
        query: { type: 3 },
      },
      inValidBody: {
        emptyBody: {},
      },
      inValidPosition: {
        position: '1',
      },
      invValidColumnId: {
        params: {
          appId: '123456789012345678901234',
          tableId: '123456789012345678911111',
          columnId: 1,
        },
      },
      inValidDatatype: {
        params: {
          tableId: '123456789012345678911111',
          columnId: '123456789012345678900000',
        },
        body: {
          datatype: 'digit',
        },
      },
      inValidType: {
        body: {
          name: 1,
        },
      },
      inValidDatatypeProperty: {
        params: {
          tableId: '123456789012345678911111',
          columnId: '123456789012345678900000',
        },
        body: {
          datatype: 'numeric',
          precision: 1,
          scale: -1,
        },
      },
      wholeBody: {
        body: {
          type: 'column',
          name: 'extra',
          displayName: 'Extra',
          datatype: 'numeric',
          scale: 3,
          precision: 1,
          isVisible: true,
          hasQuickFilter: false,
          isEditable: true,
        },
      },
    },
  },
  tableDataServiceResult: {
    applicationId: {
      _id: mongoClient.getObjectId('123456789012345678901234'),
    },
    tableId: {
      _id: mongoClient.getObjectId('123456789012345678911111'),
    },
    updateColumn: {
      columns: [
        {
          name: 'extra',
          displayName: 'Extra',
          datatype: 'numeric',
          scale: 3,
          precision: 1,
          isVisible: true,
          hasQuickFilter: false,
          isEditable: true,
        },
      ],
    },
  },
};

module.exports = mockData;
