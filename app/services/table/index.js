const tableDataService = require('../../dataServices').table;
const logger = require('../../common/logger');
const filer = require('../../common/filer');
const helper = require('../../common/helper');
const constants = require('../../common/constants');

class Table {
  async getTables(paramsObject, queryObject) {
    logger.debug('Executing query to get the list of tables.');
    try {
      const result = await tableDataService.getTables(paramsObject.appId, queryObject.type);
      logger.debug('Retreived result from the database');
      return result;
    } catch (err) {
      logger.error('Error while getting tables list', err);
      throw err;
    }
  }

  async createTable(paramsObject, tableObject, userObject) {
    tableObject.username = userObject.username;
    tableObject.createdAt = new Date();

    logger.debug('Inserting the table in database');

    try {
      const result = await tableDataService.createTable(paramsObject.appId, tableObject);

      if (tableObject.fileData) {
        const fileSavePath = `${constants.fs.paths.appRoot}/${paramsObject.appId}/${tableObject.type}/${tableObject.name}.csv`;
        await filer.moveFile(tableObject.fileData.path, fileSavePath, true);
      }
      logger.debug('Successfully created table');
      return {
        id: result.insertedId,
        columns: result.columns,
      };
    } catch (err) {
      if (tableObject.fileData) await filer.deleteFile(tableObject.fileData.path);
      logger.error('Error while creating table', err);
      throw err;
    }
  }

  async updateTable(paramsObject, tableObject, userObject) {
    const filePath = tableObject.fileData ? tableObject.fileData.path : null;
    delete tableObject.fileData;

    tableObject.updatedBy = userObject.username;
    tableObject.updatedAt = new Date();

    logger.debug('Updating the table in database');

    try {
      const result = await tableDataService.updateTable(paramsObject.tableId, tableObject);

      if (filePath) {
        const fileSavePath = `${constants.fs.paths.appRoot}/${paramsObject.appId}/${tableObject.type}/${tableObject.name}.csv`;
        await filer.moveFile(filePath, fileSavePath, true);
      } else if (tableObject.name) {
        filer.rename(
          `${constants.fs.paths.appRoot}/${paramsObject.appId}/${tableObject.type}/${result.oldName}.csv`,
          `${constants.fs.paths.appRoot}/${paramsObject.appId}/${tableObject.type}/${tableObject.name}.csv`,
        );
      }

      logger.debug('Successfully updated table');
      return { columns: result.columns };
    } catch (err) {
      if (filePath) await filer.deleteFile(filePath);
      logger.error('Error while updating table', err);
      throw err;
    }
  }

  async deleteTable(paramsObject) {
    logger.debug('Deleting the table from database');

    try {
      const deletedTable = await tableDataService.deleteTable(paramsObject);
      await filer.deleteFile(`${constants.fs.paths.appRoot}/${paramsObject.appId}/${deletedTable.type}/${deletedTable.name}.csv`);
      logger.debug('Successfully deleted table');
      return {
        ok: !!deletedTable,
      };
    } catch (err) {
      logger.error('Error while deleting table', err);
      throw err;
    }
  }

  async moveTable(paramsObject, position) {
    logger.debug('Moving the table in database');

    try {
      const result = await tableDataService.moveTable(paramsObject, position);
      logger.debug('Successfully moved table');
      return {
        ok: result ? result.result.nModified > 0 : false,
      };
    } catch (err) {
      logger.error('Error while moving table', err);
      throw err;
    }
  }

  async moveTables(paramsObject, bodyParams) {
    logger.debug('Moving tables in database');
    try {
      const result = await tableDataService.moveTables(paramsObject, bodyParams);
      logger.debug('Successfully moved tables');
      return {
        ok: result ? result.result.nModified > 0 : false,
      };
    } catch (err) {
      logger.error('Error while moving tables', err);
      throw err;
    }
  }

  async getColumns(paramsObject) {
    logger.debug('Executing query to get the list of columns.');
    try {
      const result = await tableDataService.getColumns(paramsObject);
      logger.debug('Retreived result from the database');
      return result.columns || [];
    } catch (err) {
      logger.error('Error while getting column list', err);
      throw err;
    }
  }

  async createColumn(paramsObject, columnObject, userObject) {
    columnObject.username = userObject.username;
    columnObject.createdAt = new Date();

    logger.debug('Inserting the column in database');

    try {
      const result = await tableDataService.createColumn(paramsObject.tableId, columnObject);
      logger.debug('Successfully created column');
      return {
        id: result,
      };
    } catch (err) {
      logger.error('Error while creating column', err);
      throw err;
    }
  }

  async updateColumn(paramsObject, columnObject, userObject) {
    columnObject.updatedBy = userObject.username;
    columnObject.updatedAt = new Date();

    logger.debug('Updating the column in database');

    try {
      const result = await tableDataService.updateColumn(paramsObject, helper.flattenObject(columnObject));
      logger.debug('Successfully updated column');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while updating column', err);
      throw err;
    }
  }

  async deleteColumn(paramsObject) {
    logger.debug('Deleting the column in database');

    try {
      const result = await tableDataService.deleteColumn(paramsObject);
      logger.debug('Successfully deleted column');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while deleting column', err);
      throw err;
    }
  }

  async moveColumn(paramsObject, moveObject) {
    logger.debug('Moving the column in database');

    try {
      const result = await tableDataService.moveColumn(paramsObject, moveObject.position);
      logger.debug('Successfully moved column');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while moving column', err);
      throw err;
    }
  }
}

module.exports = new Table();
