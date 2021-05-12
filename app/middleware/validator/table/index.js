const ControllerHelper = require('../../../common/controllerHelper');
const logger = require('../../../common/logger');
const constants = require('../../../common/constants');
const validator = require('./validator');
const commonValidator = require('../common');
const filer = require('../../../common/filer');

class Table {
  async validateGetTables(req, res, next) {
    try {
      validator.validateTableRequestParams(req, constants.table.get.paramsInvalid);
      validator.validateGetTableRequestQuery(req, constants.table.get.queryInvalid);
      await commonValidator.application.validateAppExists(req, constants.table.get.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get tables', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.table.get.error);
    }
  }

  async validateCreateTable(req, res, next) {
    try {
      validator.validateTableRequestParams(req, constants.table.create.paramsInvalid);
      validator.validateTableRequestBody(req);
      await commonValidator.application.validateAppExists(req, constants.table.create.noAppId);
      await validator.validateTableNameNotUsed(req, constants.table.create.tableExists);
      next();
    } catch (errorObject) {
      logger.warning('Cannot create table', errorObject);
      if (req.body && req.body.fileData) await filer.deleteFile(req.body.fileData.path);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.table.create.error);
    }
  }

  async validateUpdateTable(req, res, next) {
    try {
      validator.validateTableRequestParams(req, constants.table.update.paramsInvalid);
      validator.validateTableRequestBody(req);
      await commonValidator.application.validateAppExists(req, constants.table.update.noAppId);
      await validator.validateTableExists(req, constants.table.update.tableDoesNotExist);
      if (req.body.name) await validator.validateTableNameNotUsed(req, constants.table.update.tableExists);
      next();
    } catch (errorObject) {
      logger.warning('Cannot update table', errorObject);
      if (req.body && req.body.fileData) await filer.deleteFile(req.body.fileData.path);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.table.update.error);
    }
  }

  async validateDeleteTable(req, res, next) {
    try {
      validator.validateTableRequestParams(req, constants.table.delete.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.table.delete.noAppId);
      await validator.validateTableExists(req, constants.table.delete.tableDoesNotExist);
      next();
    } catch (errorObject) {
      logger.warning('Cannot delete table', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.table.delete.error);
    }
  }

  async validateMoveTables(req, res, next) {
    try {
      validator.validateTableRequestParams(req, constants.table.move.paramsInvalid);
      validator.validateMoveTableRequestBody(req);
      await commonValidator.application.validateAppExists(req, constants.table.move.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot move table(s)', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.table.move.error);
    }
  }

  async validateGetColumns(req, res, next) {
    try {
      validator.validateColumnRequestParams(req, constants.table.column.get.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.table.column.get.noAppId);
      await validator.validateTableExists(req, constants.table.column.get.noTableId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get columns', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.table.column.get.error);
    }
  }

  async validateCreateColumn(req, res, next) {
    try {
      validator.validateColumnRequestParams(req, constants.table.column.create.paramsInvalid);
      validator.validateColumnRequestBody(req, constants.table.column.create.bodyInvalid);
      await validator.validateTableExists(req, constants.table.column.create.noTableId);
      await validator.validateColumnNameNotUsed(req, constants.table.column.create.columnExists);
      await validator.validateDatatype(req, constants.table.column.create.invalidDatatype);
      next();
    } catch (errorObject) {
      logger.warning('Cannot create column', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.table.column.create.error);
    }
  }

  async validateUpdateColumn(req, res, next) {
    try {
      validator.validateColumnRequestParams(req, constants.table.column.update.paramsInvalid);
      validator.validateColumnRequestBody(req, constants.table.column.update.bodyInvalid);
      await validator.validateTableExists(req, constants.table.column.update.noTableId);
      await validator.validateColumnExists(req, constants.table.column.update.columnDoesNotExist);
      await validator.validateDatatype(req, constants.table.column.update.invalidDatatype);
      await validator.validateFiltersCount(req, constants.table.column.update.invalidFiltersCount);
      next();
    } catch (errorObject) {
      logger.warning('Cannot update column', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.table.column.update.error);
    }
  }

  async validateDeleteColumn(req, res, next) {
    try {
      validator.validateColumnRequestParams(req, constants.table.column.delete.paramsInvalid);
      await validator.validateTableExists(req, constants.table.column.delete.noTableId);
      await validator.validateColumnExists(req, constants.table.column.delete.columnDoesNotExist);
      next();
    } catch (errorObject) {
      logger.warning('Cannot delete column', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.table.column.delete.error);
    }
  }

  async validateMoveColumn(req, res, next) {
    try {
      validator.validateColumnRequestParams(req, constants.table.column.move.paramsInvalid);
      validator.validateMoveColumnRequestBody(req, constants.table.column.move.bodyInvalid);
      await validator.validateTableExists(req, constants.table.column.move.noTableId);
      await validator.validateColumnExists(req, constants.table.column.move.columnDoesNotExist);
      next();
    } catch (errorObject) {
      logger.warning('Cannot move column', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.table.column.move.error);
    }
  }
}

module.exports = new Table();
