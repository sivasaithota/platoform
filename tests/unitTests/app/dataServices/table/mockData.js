const mongoClient = require('../../../../../app/dataServices/mongoClient');
const constants = require('../../../../../app/common/constants');

module.exports = {
  idObject: {
    tableId: '123456789012345678901234',
    appId: '123456789012345678901234',
    columnId: '123456789012345678901234',
  },
  queryObject: {
    type: 'input',
  },
  columnObject: {
    name: 'extra',
    displayName: 'Extra',
    datatype: 'numeric',
    scale: 3,
    precision: 1,
    isVisible: true,
    hasQuickFilter: false,
    isEditable: true,
  },
  position: 1,
  mongoClientResult: {
    deleteOne: {
      result: {
        n: 1,
      },
    },
    insertOne: {
      insertedId: 1,
    },
    updateOne: {
      result: {
        nModified: 1,
      },
    },
    findOneAndUpdate: {
      value: {
        columns: ['col1', 'col2'],
      },
    },
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
  parameter: {
    createTable: {
      tableObject: {
        username: 'test',
        createdAt: new Date(),
        name: 'test',
        appId: '123456789012345678901234',
        type: 'test',
        tag: 'test',
        isVisible: 'true',
        displayName: 'test',
        fileName: 'test',
        columns: [{ name: 'test' }],
      },
    },
    tableObject: {
      username: 'test',
      createdAt: '19/08/19',
      name: 'test',
      appId: '123456789012345678901234',
      type: 'test',
      tag: 'test',
      isVisible: 'true',
      displayName: 'test',
      fileName: 'test',
      createdBy: '19/04/2019',
      updatedBy: 'test',
      updatedAt: '19/04/2019',
      columns: [{ name: 'test' }],
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
        { $pull: { refTables: mongoClient.getObjectId('123456789012345678901234') } },
      ],
      [constants.collection.names.application,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
        {
          $push: {
            refTables: {
              $each: [mongoClient.getObjectId('123456789012345678901234')],
              $position: 1,
            },
          },
        },
      ],
    ],
    deleteTable: {
      deleteOne: [
        constants.collection.names.table,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
      ],
      updateOne: [
        constants.collection.names.application,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
        { $pull: { refTables: mongoClient.getObjectId('123456789012345678901234') } },
      ],
    },
    updateTable: [
      constants.collection.names.table,
      { _id: mongoClient.getObjectId('123456789012345678901234') },
      {
        $set: {
          username: 'test',
          createdAt: '19/08/19',
          name: 'test',
          appId: '123456789012345678901234',
          type: 'test',
          tag: 'test',
          isVisible: 'true',
          displayName: 'test',
          fileName: 'test',
          createdBy: '19/04/2019',
          updatedBy: 'test',
          updatedAt: '19/04/2019',
        },
        columns: [{
          name: 'test',
          displayName: 'test',
          isVisible: true,
          isEditable: true,
          hasFilter: false,
          createdBy: 'test',
          createdAt: '19/04/2019',
          updatedBy: 'test',
          updatedAt: '19/04/2019',
        }],
      },
    ],
    getColumns: [
      constants.collection.names.table,
      { _id: mongoClient.getObjectId('123456789012345678901234') },
      {
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
    ],
    deleteColumn: [
      constants.collection.names.table,
      { _id: mongoClient.getObjectId('123456789012345678901234') },
      {
        $pull: {
          columns: { _id: mongoClient.getObjectId('123456789012345678901234') },
        },
      },
    ],
    moveColumn: [
      [
        constants.collection.names.table,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
        {
          $pull: {
            columns: { _id: mongoClient.getObjectId('123456789012345678901234') },
          },
        },
        {
          columns: {
            $elemMatch: { _id: mongoClient.getObjectId('123456789012345678901234') },
          },
        },
      ],
      [
        constants.collection.names.table,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
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
        _id: mongoClient.getObjectId('123456789012345678901234'),
        'columns._id': mongoClient.getObjectId('123456789012345678901234'),
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
