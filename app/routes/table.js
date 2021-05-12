const Base = require('./base');
const validator = require('../middleware/validator/table');
const controller = require('../controllers/table');
const parser = require('../middleware/parser');
const kc = require('../middleware/keycloak');
const { table } = require('../common/constants').permissions;

class Table extends Base {
  constructor() {
    super();
    this.get('/', kc.enforcer(table.read), validator.validateGetTables, controller.getTables);
    this.post('/', kc.enforcer(table.create), parser.parseSchema, validator.validateCreateTable, controller.createTable);
    this.patch('/:tableId', kc.enforcer(table.update), parser.parseSchema, validator.validateUpdateTable, controller.updateTable);
    this.delete('/:tableId', kc.enforcer(table.delete), validator.validateDeleteTable, controller.deleteTable);
    this.patch('/moveTo/:newPosition', kc.enforcer(table.update), validator.validateMoveTables, controller.moveTables);
    this.get('/:tableId/columns', kc.enforcer(table.read), validator.validateGetColumns, controller.getColumns);
    this.post('/:tableId/columns', kc.enforcer(table.create), validator.validateCreateColumn, controller.createColumn);
    this.patch('/:tableId/columns/:columnId', kc.enforcer(table.update), validator.validateUpdateColumn, controller.updateColumn);
    this.delete('/:tableId/columns/:columnId', kc.enforcer(table.delete), validator.validateDeleteColumn, controller.deleteColumn);
    this.post('/:tableId/columns/:columnId/move', kc.enforcer(table.create), validator.validateMoveColumn, controller.moveColumn);
  }
}

module.exports = Table;
