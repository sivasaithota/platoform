const mongoClient = require('../mongoClient');
const constants = require('../../common/constants');
const dataServiceHelper = require('./helper');

class Table {
  async getTableByName(appId, tableName) {
    const query = {
      name: tableName,
      appId: mongoClient.getObjectId(appId),
    };
    return mongoClient.findOne(constants.collection.names.table, query);
  }

  async getTableById(tableId) {
    const query = {
      _id: mongoClient.getObjectId(tableId),
    };
    return mongoClient.findOne(constants.collection.names.table, query);
  }

  async getColumnByName(tableId, columnName) {
    const query = {
      _id: mongoClient.getObjectId(tableId),
      columns: {
        $elemMatch: {
          name: columnName,
        },
      },
    };
    return mongoClient.findOne(constants.collection.names.table, query);
  }

  async getColumnById(tableId, columnId) {
    const query = {
      _id: mongoClient.getObjectId(tableId),
      columns: {
        $elemMatch: {
          _id: mongoClient.getObjectId(columnId),
        },
      },
    };
    return mongoClient.findOne(constants.collection.names.table, query);
  }

  async replaceTables(appId, tables) {
    const appObjectId = mongoClient.getObjectId(appId);
    constants.types.table.forEach((type) => {
      tables.filter(table => table.type === type).forEach((table, index) => {
        table.appId = appObjectId;
        table.typePosition = index;
        table.columns.forEach(column => Object.assign(column, { _id: mongoClient.getObjectId() }));
      });
    });
    const deletedTables = await mongoClient.find(constants.collection.names.table, { appId: appObjectId });
    await mongoClient.insertMany(constants.collection.names.table, tables);
    await mongoClient.deleteMany(
      constants.collection.names.table,
      { _id: { $in: deletedTables.map(table => table._id) } },
    );
    return { deletedTables };
  }

  async getTables(appId, type, fetchAll = false, showColumns = false) {
    const projection = !fetchAll ? dataServiceHelper.projections.table : {};
    return mongoClient.find(
      constants.collection.names.table,
      { ...{ appId: mongoClient.getObjectId(appId) }, ...(type ? { type } : {}) },
      { ...projection, ...(showColumns ? dataServiceHelper.projections.column : {}) },
      { type: 1, typePosition: 1 },
    );
  }

  async createTable(appId, tableObject) {
    const appObjectId = mongoClient.getObjectId(appId);
    const auditProperties = {
      createdBy: tableObject.username,
      createdAt: tableObject.createdAt,
      updatedBy: tableObject.username,
      updatedAt: tableObject.createdAt,
    };
    const document = {
      name: tableObject.name,
      appId: appObjectId,
      displayName: tableObject.displayName,
      type: tableObject.type,
      tag: tableObject.tag || constants.defaultProperties.tag,
      isVisible: tableObject.isVisible,
      ...auditProperties,
    };

    if (tableObject.columns) {
      document.columns = tableObject.columns.map(column => ({ _id: mongoClient.getObjectId(), ...column, ...auditProperties }));
    }

    document.typePosition = await mongoClient.countDocuments(
      constants.collection.names.table,
      { appId: appObjectId, type: tableObject.type },
    );

    const result = await mongoClient.insertOne(constants.collection.names.table, document);
    return { ...result, columns: document.columns };
  }

  async updateTable(tableId, tableObject) {
    const document = tableObject;
    const auditProperties = {
      createdBy: tableObject.updatedBy,
      createdAt: tableObject.updatedAt,
      updatedBy: tableObject.updatedBy,
      updatedAt: tableObject.updatedAt,
    };

    if (tableObject.columns) {
      document.columns = tableObject.columns.map(column => ({ _id: mongoClient.getObjectId(), ...column, ...auditProperties }));
    }

    const result = await mongoClient.findOneAndUpdate(
      constants.collection.names.table,
      { _id: mongoClient.getObjectId(tableId) },
      { $set: document },
      { name: 1 },
    );

    return { oldName: result.value.name, columns: document.columns };
  }

  async deleteTable(idObject) {
    const tableObjectId = mongoClient.getObjectId(idObject.tableId);
    const deleteQuery = {
      _id: tableObjectId,
    };

    const { name, type, typePosition } = (await mongoClient.findOneAndDelete(constants.collection.names.table, deleteQuery)).value;
    const updateQuery = {
      appId: mongoClient.getObjectId(idObject.appId),
      type,
      typePosition: { $gt: typePosition },
    };
    await mongoClient.updateMany(constants.collection.names.table, updateQuery, { $inc: { typePosition: -1 } });
    return { name, type };
  }

  async moveTables(paramsObject, moveObject) {
    const { newPosition: _newPosition, appId } = paramsObject;
    const { tableIds, newTag } = moveObject;
    const tableObjectIds = tableIds.map(id => mongoClient.getObjectId(id));
    const newPosition = parseInt(_newPosition, 10);
    // Get the tableList
    const tables = await mongoClient.find(
      constants.collection.names.table,
      { _id: { $in: tableObjectIds } },
      { type: 1, typePosition: 1 },
    );
    const oldPosition = Math.min(...tables.map(t => t.typePosition));
    const { type } = tables[0];
    // If old and new positions are same, then tables are not moved

    if (oldPosition === newPosition) return;
    // Update the tables' typePosition,
    await mongoClient.updateMany(
      constants.collection.names.table,
      { _id: { $in: tableObjectIds } },
      {
        $inc: { typePosition: newPosition - oldPosition },
        $set: { tag: newTag },
      },
    );
    // Shift the positions of the other tables if they fall between the moved tables' old and new positions

    return mongoClient.updateMany(
      constants.collection.names.table,
      {
        _id: { $nin: tableObjectIds },
        appId: mongoClient.getObjectId(appId),
        type,
        typePosition: newPosition < oldPosition
          ? { $lt: oldPosition, $gte: newPosition }
          : { $gte: oldPosition + tableObjectIds.length, $lt: newPosition + tableObjectIds.length },
      },
      {
        $inc: { typePosition: newPosition < oldPosition ? tableObjectIds.length : -tableObjectIds.length },
      },
    );
  }

  async getColumns(idObject) {
    const projection = dataServiceHelper.projections.column;
    const query = {
      _id: mongoClient.getObjectId(idObject.tableId),
    };
    return mongoClient.findOne(constants.collection.names.table, query, projection);
  }

  async createColumn(tableId, columnObject) {
    columnObject = Object.assign({ _id: mongoClient.getObjectId() }, columnObject);
    const query = {
      _id: mongoClient.getObjectId(tableId),
    };
    const update = {
      $push: {
        columns: columnObject,
      },
    };

    await mongoClient.updateOne(constants.collection.names.table, query, update);
    return columnObject._id;
  }

  async updateColumn(idObject, columnObject) {
    const query = {
      _id: mongoClient.getObjectId(idObject.tableId),
      'columns._id': mongoClient.getObjectId(idObject.columnId),
    };
    const update = {
      $set: {},
    };

    Object.keys(columnObject).forEach(propertyName => {
      update.$set[`columns.$.${propertyName}`] = columnObject[propertyName];
    });

    return mongoClient.updateOne(constants.collection.names.table, query, update);
  }

  async deleteColumn(idObject) {
    const query = {
      _id: mongoClient.getObjectId(idObject.tableId),
    };
    const update = {
      $pull: {
        columns: {
          _id: mongoClient.getObjectId(idObject.columnId),
        },
      },
    };

    return mongoClient.updateOne(constants.collection.names.table, query, update);
  }

  async moveColumn(idObject, position) {
    const columnId = mongoClient.getObjectId(idObject.columnId);
    const tableId = mongoClient.getObjectId(idObject.tableId);
    // Extract the column from its original position
    const { columns } = (await mongoClient.findOneAndUpdate(
      constants.collection.names.table,
      { _id: tableId },
      { $pull: { columns: { _id: columnId } } },
      { columns: { $elemMatch: { _id: columnId } } },
    )).value;
    // Insert the column back into the table, at the new position
    return mongoClient.updateOne(
      constants.collection.names.table,
      { _id: tableId },
      {
        $push: {
          columns: {
            $each: columns,
            $position: position,
          },
        },
      },
    );
  }
}

module.exports = new Table();
