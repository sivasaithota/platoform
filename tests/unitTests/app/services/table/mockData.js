const mongoClient = require('../../../../../app/dataServices/mongoClient');
module.exports = {
  paramsObject: {
    appId: '123456789012345678901234',
    tableId: '123456789012345678901234',
    columnId: '123456789012345678900000',
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
  userObject: {
    username: 'test',
  },
  tableObject: {
    name: 'customers',
    displayName: 'Customers',
    isVisible: true,
    type: 'input',
    fileName: 'test',
    fileData: { path: 'test/' },
  },
  queryObject: {
    type: 'input',
  },
  moveObject: { position: 1 },
  tableDataServiceResult: {
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
    updateTable: {
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
    deleteOne: {
      result: {
        n: 1,
      },
    },
    insertOne: {
      insertedId: 1,
    },
    updateOne: [
      {
        result: {
          nModified: 10,
        },
      },
      {
        result: {
          nModified: 0,
        },
      },
    ],
    createColumn: {
      _id: mongoClient.getObjectId('123456789012345678901234'),
    },
  },
  parameter: {
    updateTable: {
      tableObjectNoTable: {
        name: 'test',
      },
      tableObjectTable: {
        type: 'csv',
        fileName: 'test',
        fileData: { path: 'test/' },
        columns: [{ name: 'test' }],
      },
    },
  },
  mongoClientParameter: {
    updateTable: [
      {
        name: 'test',
        updatedBy: 'test',
      },
      {
        type: 'csv',
        fileName: 'test',
        updatedBy: 'test',
        columns: [{ name: 'test' }],
      },
    ],
    movefileFiler: [
      'test/',
      '/analytics_center/123456789012345678901234/input/test',
      true,
    ],
    updateColumn: [{
      appId: '123456789012345678901234',
      tableId: '123456789012345678901234',
      columnId: '123456789012345678900000',
    },
    {
      name: 'extra',
      displayName: 'Extra',
      datatype: 'numeric',
      scale: 3,
      precision: 1,
      isVisible: true,
      hasQuickFilter: false,
      isEditable: true,
      updatedBy: 'test',
    },
    ],
  },
  properties: {
    createTable: [
      'username', 'fileData', 'type', 'createdAt', 'displayName', 'fileName', 'isVisible', 'name',
    ],
    createColumn: [
      'name', 'displayName', 'datatype', 'scale', 'precision', 'isVisible', 'hasQuickFilter', 'isEditable', 'username', 'createdAt', 'updatedAt', 'updatedBy',
    ],
  },
};
