const mongoClient = require('../../../../../app/dataServices/mongoClient');
const constants = require('../../../../../app/common/constants');

const mockData = {
  responseObj: {
    status: (code) => {
      return mockData.responseObj;
    },
    send: (result) => {
    },
  },
  requestobj: {
    getTables: {
      params: {
        appId: '123456789012345678901234',
        tableId: '123456789012345678911111',
        columnId: '123456789012345678900000',
      },
      query: {
        type: 'input',
      },
    },
    createTable: {
      params: {
        appId: '123456789012345678901234',
        tableId: '123456789012345678911111',
        columnId: '123456789012345678900000',
      },
      body: {
        position: 1,
        type: 'test',
        fileName: 'test',
        fileData: { path: 'test/' },
        name: 'test',
        tag: 'test',
        isVisible: true,
        displayName: 'test',
        columns: [{ name: 'test' }],
        username: 'test',
      },
      user: {
        username: 'test',
      },
    },
    moveTable: {
      params: {
        appId: '123456789012345678901234',
        tableId: '123456789012345678911111',
        columnId: '123456789012345678900000',
      },
      body: {
        position: 1,
      },
    },
    deleteTable: {
      params: {
        appId: '123456789012345678901234',
        tableId: '123456789012345678911111',
      },
    },
    deleteColumn: {
      params: {
        appId: '123456789012345678901234',
        tableId: '123456789012345678911111',
        columnId: '123456789012345678900000',
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
        columnId: '123456789012345678900000',
      },
      body: {
        position: 1,
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
  mongoClientParameter: {
    getTables: [
      constants.collection.names.table,
      { appId: mongoClient.getObjectId('123456789012345678901234'), type: 'input' },
      {
        _id: 1, name: 1, displayName: 1, type: 1, tag: 1, isVisible: 1,
      },
      { typePosition: 1 },
    ],
    moveTable: [
      [constants.collection.names.application,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
        { $pull: { refTables: mongoClient.getObjectId('123456789012345678911111') } },
      ],
      [constants.collection.names.application,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
        {
          $push: {
            refTables: {
              $each: [mongoClient.getObjectId('123456789012345678911111')],
              $position: 1,
            },
          },
        },
      ],
    ],
    deleteTable: {
      deleteOne: [
        constants.collection.names.table,
        { _id: mongoClient.getObjectId('123456789012345678911111') },
      ],
      updateOne: [
        constants.collection.names.application,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
        { $pull: { refTables: mongoClient.getObjectId('123456789012345678911111') } },
      ],
    },
    getColumns: {
      _id: mongoClient.getObjectId('123456789012345678911111'),
      projection: {
        'columns._id': 1,
        'columns.name': 1,
        'columns.displayName': 1,
        'columns.datatype': 1,
        'columns.length': 1,
        'columns.precision': 1,
        'columns.scale': 1,
        'columns.isVisible': 1,
        'columns.hasFilter': 1,
        'columns.isEditable': 1,
      },
    },
    deleteColumn: [
      constants.collection.names.table,
      {
        _id: mongoClient.getObjectId('123456789012345678911111'),
      },
      {
        $pull:
        { columns: { _id: mongoClient.getObjectId('123456789012345678900000') } },
      },
    ],
    moveColumn: [
      [
        constants.collection.names.table,
        { _id: mongoClient.getObjectId('123456789012345678911111') },
        {
          $pull: {
            columns: { _id: mongoClient.getObjectId('123456789012345678900000') },
          },
        },
        {
          columns: {
            $elemMatch: { _id: mongoClient.getObjectId('123456789012345678900000') },
          },
        },
      ],
      [
        constants.collection.names.table,
        { _id: mongoClient.getObjectId('123456789012345678911111') },
        {
          $push: {
            columns: {
              $each: ['col1', 'col2'],
              $position: 1,
            },
          },
        },
      ],
    ],
    updateColumn: [
      constants.collection.names.table,
      {
        _id: mongoClient.getObjectId('123456789012345678911111'),
        'columns._id': mongoClient.getObjectId('123456789012345678900000'),
      },
      {
        $set: {
          'columns.$.name': 'extra',
          'columns.$.displayName': 'Extra',
          'columns.$.datatype': 'numeric',
          'columns.$.scale': 3,
          'columns.$.precision': 1,
          'columns.$.isVisible': true,
          'columns.$.hasQuickFilter': false,
          'columns.$.isEditable': true,
        },
      },
    ],
    updateTable: [
      constants.collection.names.table,
      { _id: mongoClient.getObjectId('123456789012345678911111') },
      {
        $set: {
          type: 'csv',
          fileName: 'test',
          name: 'test',
          updatedBy: 'test',
        },
        columns: [{
          name: 'test',
          displayName: 'test',
          isVisible: true,
          isEditable: true,
          hasFilter: false,
          createdBy: 'test',
          updatedBy: 'test',
        }],
      },
    ],
  },
  mongoClientResult: {
    getTables: [
      {
        _id: '5d256e123643630015518610',
        name: 'customers',
        displayName: 'Customers',
        type: 'input',
        tag: {
          name: 'untagged',
          class: 'tag-none',
        },
        isVisible: true,
      },
    ],
    insertOne: {
      insertedId: 1,
    },
    updateOne: [
      {
        result: {
          nModified: 1,
        },
      },
      {
        result: {
          nModified: 0,
        },
      },
    ],
    findOneAndUpdate: {
      value: {
        columns: ['col1', 'col2'],
      },
    },
    deleteOne: {
      result: {
        n: 1,
      },
    },
    updateTable: {
      name: 'test',
      displayName: 'test',
      isVisible: true,
      isEditable: true,
      hasFilter: false,
      createdBy: 'test',
      updatedBy: 'test',
    },
    getColumns: {
      columns: [
        {
          name: 'FinishedProduct',
          _id: '5d256e12364363001551860d',
          displayName: 'FinishedProduct',
          datatype: 'text',
          isVisible: true,
          isEditable: false,
          hasFilter: true,
          createdBy: 'enframe_dev',
          createdAt: '2019-07-10T04:48:18.046Z',
          updatedBy: 'enframe_dev',
          updatedAt: '2019-07-10T04:48:18.046Z',
        },
      ],
    },
  },
  properties: {
    createTable: [
      ['name', 'appId', 'displayName', 'type', 'tag', 'isVisible', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'fileName', 'columns', 'typePosition'],
      ['name', '_id', 'displayName', 'datatype', 'isVisible', 'isEditable', 'hasFilter', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'],
    ],
    createColumn: [
      'name', 'displayName', 'datatype', 'scale', 'precision', 'isVisible', 'hasQuickFilter', 'isEditable', 'username', '_id', 'createdAt',
    ],
  },
};
module.exports = mockData;
