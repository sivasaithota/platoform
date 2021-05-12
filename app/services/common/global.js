const globalDataService = require('../../dataServices').global;
const constants = require('../../common/constants');

class Global {
  getDatatype(datatype) {
    return globalDataService.getTemplateType(constants.types.template.datatype, datatype);
  }

  getParameterType(parameterType) {
    return globalDataService.getTemplateType(constants.types.template.parameterType, parameterType);
  }

  getReportType(reportType) {
    return globalDataService.getTemplateType(constants.types.template.reportType, reportType);
  }

  async getTableauSettings() {
    const result = await globalDataService.getSetting('tableau');
    return result.tableau;
  }
}

module.exports = new Global();
