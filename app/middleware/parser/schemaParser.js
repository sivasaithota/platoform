const xlsx = require('xlsx');
const util = require('util');
const validator = require('../validator/table/validator');
const constants = require('../../common/constants');
const logger = require('../../common/logger');
const filer = require('../../common/filer');
const helper = require('../../common/helper');

class SchemaParser {
  _getTypes(columnHeaders, rows) {
    // Initialize all column types as String
    const types = new Array(columnHeaders.length).fill(String);

    if (rows.length) {
      // Detect first set of types from first row
      rows[0].forEach((value, index) => {
        types[index] = value.constructor;
      });
      // Detect types for entire columns, changing to a more general type if some cell doesn't match expected type
      rows.slice(1).forEach((row) => {
        row.forEach((value, index) => {
          switch (types[index]) {
            case String:
              break;
            default:
              if (value.constructor === String) types[index] = String;
          }
        });
      });
    }
    // Return types as strings
    return types.map(type => type.name);
  }

  async _convertXLSXToCSV(fromPath, toPath) {
    try {
      const workbook = xlsx.readFile(fromPath);
      const csvData = xlsx.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
      await filer.writeFile(toPath, csvData);
    } catch (err) {
      logger.error('Error converting xlsx file to csv');
      throw constants.file.csvConversionError;
    } finally {
      filer.deleteFile(fromPath);
    }
  }

  async _getColumnsFromCSV(data, detectDatatypes, normalizeTitles) {
    // Start with extracting column names
    let workbook = xlsx.read(data, { type: 'binary', sheetRows: 1, raw: true });
    const [columnHeader] = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
    // If datatypes have to be detected, extract the rows as well
    let rows;
    if (detectDatatypes) {
      workbook = xlsx.read(data, { type: 'binary', cellDates: true });
      [, ...rows] = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, dateNF: 22 });
    }
    // Construct array of column objects from columnHeader
    const invalidColumnNames = [];
    const columns = [];
    await Promise.all(columnHeader.map(async (columnName, index) => {
      if (!validator.validateColumnName(columnName)) {
        invalidColumnNames.push(columnName);
        return null;
      }
      const name = columnName.trim();
      columns[index] = {
        name,
        displayName: normalizeTitles ? helper.parseName(name) : name,
        ...constants.defaultProperties.column,
      };
    }));
    // If detectDatatypes is true, detect datatypes and assign to column object
    if (detectDatatypes && invalidColumnNames.length === 0) {
      const columnTypes = this._getTypes(columnHeader, rows);
      columnTypes.forEach((type, index) => Object.assign(columns[index], { datatype: constants.datatypeMap[type] }));
    }

    return { columns, invalidColumnNames };
  }

  /**
   * Add delimiter to csv if it doesn't contain one.
   * @param {*} fileContents
   * @param {*} delimiter - Defaults to comma
   */
  _addDelimiterToCSV(fileContents, delimiter = ',') {
    if (!fileContents.startsWith('sep=')) {
      // Excel rule to set default delimiter
      fileContents = `sep=${delimiter}\n${fileContents}`;
    }

    return fileContents;
  }

  async parseCsv(filePath, detectDatatypes, normalizeTitles) {
    let fileContents = await filer.readFile(filePath);
    fileContents = this._addDelimiterToCSV(fileContents);

    const { columns, invalidColumnNames } = await this._getColumnsFromCSV(fileContents, detectDatatypes, normalizeTitles);
    if (invalidColumnNames.length > 0) {
      const errorMessage = util.format(constants.table.create.columnNameInvalid, invalidColumnNames.join(', '));
      throw errorMessage;
    }
    return columns;
  }

  async parseSchemaFile(fileData, detectDatatypes, normalizeTitles) {
    const filePath = fileData.path;

    if (fileData.name.toLocaleLowerCase().endsWith('xlsx')) {
      fileData.path = filePath.replace('xlsx', 'csv');
      fileData.name = fileData.name.replace('xlsx', 'csv');
      await this._convertXLSXToCSV(filePath, fileData.path);
    }

    return this.parseCsv(fileData.path, detectDatatypes, normalizeTitles);
  }
}

module.exports = new SchemaParser();
