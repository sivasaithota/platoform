const ControllerHelper = require('../../common/controllerHelper');
const tableService = require('../../services/table');
const constants = require('../../common/constants');
const logger = require('../../common/logger');

class Table {
  async getTables(req, res) {
    logger.info('Getting all the tables for app', req.params.appId);
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await tableService.getTables(req.params, req.query);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting all tables!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.table.get.error,
        },
      });
    }
  }

  async createTable(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Creating new table');
      const result = await tableService.createTable(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.successfulCreate,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error creating new table!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.table.create.error,
        },
      });
    }
  }

  async updateTable(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating table');
      const result = await tableService.updateTable(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error updating table!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.table.update.error,
        },
      });
    }
  }

  async deleteTable(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deleting table');
      const result = await tableService.deleteTable(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error deleting table!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.table.delete.error,
        },
      });
    }
  }

  async moveTables(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Moving table(s)');
      const result = await tableService.moveTables(req.params, req.body);

      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error moving table(s)!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.table.move.error,
        },
      });
    }
  }

  async getColumns(req, res) {
    logger.info('Getting all the columns for table', req.params.tableId);
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await tableService.getColumns(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting all tables!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.table.column.get.error,
        },
      });
    }
  }

  async createColumn(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Creating new column in table', req.params.tableId);
      const result = await tableService.createColumn(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.successfulCreate,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error creating new column!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.table.column.create.error,
        },
      });
    }
  }

  async updateColumn(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating column', req.params.columnId);
      const result = await tableService.updateColumn(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error updating column!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.table.column.update.error,
        },
      });
    }
  }

  async deleteColumn(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deleting column', req.params.columnId);
      const result = await tableService.deleteColumn(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error deleting column!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.table.column.delete.error,
        },
      });
    }
  }

  async moveColumn(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Moving column', req.params.columnId);
      const result = await tableService.moveColumn(req.params, req.body);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error moving column!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.table.column.error,
        },
      });
    }
  }
}

module.exports = new Table();
