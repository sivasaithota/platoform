const tableDataService = require('../../dataServices').table;
const logger = require('../../common/logger');

class Table {
  async checkIfTableExistsByName(idObject, tableName) {
    logger.info('Checking if table exists by name');
    const result = await tableDataService.getTableByName(idObject.appId, tableName);
    const tableExists = result && result._id.toString() !== idObject.tableId;
    logger.debug(tableExists ? 'Table exists' : 'Table does not exist');
    return tableExists;
  }

  async checkIfTableExistsById(tableId) {
    logger.info('Checking if table exists by Id');
    const result = await tableDataService.getTableById(tableId);
    const tableExists = result && result._id.toString() === tableId;
    logger.debug(tableExists ? 'Table exists' : 'Table does not exist');
    return tableExists;
  }

  async checkIfColumnExistsByName(tableId, columnName) {
    logger.info('Checking if column exists by name');
    const result = await tableDataService.getColumnByName(tableId, columnName);
    const columnExists = result && result._id.toString() === tableId;
    logger.debug(columnExists ? 'Column exists' : 'Column does not exist');
    return columnExists;
  }

  async checkIfColumnExistsById(tableId, columnId) {
    logger.info('Checking if column exists by Id');
    const result = await tableDataService.getColumnById(tableId, columnId);
    const columnExists = result && result._id.toString() === tableId;
    logger.debug(columnExists ? 'Column exists' : 'Column does not exist');
    return columnExists;
  }

  async getColumnData(tableId, columnId) {
    logger.debug('Fetching column data', { tableId, columnId });
    return (await tableDataService.getColumnById(tableId, columnId)).columns[0];
  }

  async replaceAllTablesInApplication(appId, tables) {
    logger.info('Replacing tables for application', appId);
    const result = await tableDataService.replaceTables(appId, tables);
    logger.debug('Tables replaced successfully');
    return result;
  }
}

module.exports = new Table();
