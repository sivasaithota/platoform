const applicationCommonValidator = require('./application');
const ParameterTypeCommonValidator = require('./parameterType');
const tableCommonValidator = require('./table');
const typeCommonValidator = require('./type');

module.exports = {
  application: applicationCommonValidator,
  ParameterType: ParameterTypeCommonValidator,
  table: tableCommonValidator,
  type: typeCommonValidator,
};
