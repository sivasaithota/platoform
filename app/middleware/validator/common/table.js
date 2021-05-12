const commonServices = require('../../../services/common');
const tableServices = require('../../../services/table');
const typeValidator = require('../common/type');

class Table {
  async validateDatatype(columnObject, idObject = null) {
    if (idObject && !columnObject.datatype) {
      columnObject.datatype = (await commonServices.table.getColumnData(idObject.tableId, idObject.columnId)).datatype;
    }

    const template = await commonServices.global.getDatatype(columnObject.datatype);
    const validationResult = {
      specificProperties: {},
      invalidProperties: {},
      isValid: false,
    };

    if (!template) {
      validationResult.invalidProperties.datatype = 'Not a valid datatype';
    } else if (template.properties.every((property) => {
      if (columnObject[property] != null && !typeValidator.validateNumber(columnObject[property], true, 0)) {
        validationResult.invalidProperties[property] = 'Must be a non-negative integer';
        return false;
      }

      validationResult.specificProperties[property] = columnObject[property];
      return true;
    })) {
      validationResult.isValid = true;
    }

    return validationResult;
  }

  async validateFiltersCount(columnObject, idObject = null) {
    const columns = await tableServices.getColumns(idObject);
    const result = columns.filter(item => item.hasFilter);
    return result.length < 3; // 3 - maximum selected filters
  }
}

module.exports = new Table();
