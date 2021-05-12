const typeCommonValidator = require('./type');

class ParameterType {
  constructor() {
    this.result = false;
    this.invalidProperties = {};
    this.specificProperties = {};
  }

  _validateInputBox(parameterObject) {
    if (!typeCommonValidator.validateBoolean(parameterObject.isNumeric)) {
      this.invalidProperties.isNumeric = 'Must be a true/false boolean value';
    } else if (parameterObject.defaultValue && parameterObject.isNumeric && Number.isNaN(parameterObject.defaultValue)) {
      this.invalidProperties.defaultValue = 'Must be a valid numeric value';
    } else {
      this.specificProperties = {
        isNumeric: parameterObject.isNumeric,
        defaultValue: parameterObject.defaultValue,
      };
      this.result = true;
    }
  }

  _validateDropdownSingle(parameterObject) {
    let isDefaultValueInDropdown = false;

    if (parameterObject.defaultValue && !typeCommonValidator.validateString(parameterObject.defaultValue)) {
      this.invalidProperties.defaultValue = 'Must be a string';
    } else if (!typeCommonValidator.validateArray(parameterObject.dropdownValues)) {
      this.invalidProperties.dropdownValues = 'Must be an array';
    } else if (parameterObject.dropdownValues
      && (new Set(parameterObject.dropdownValues)).size !== parameterObject.dropdownValues.length) {
      this.invalidProperties.dropdownValues = 'Parameter options should be unique';
    } else {
      const valid = parameterObject.dropdownValues.every((value, index) => {
        if (!typeCommonValidator.validateString(value)) {
          this.invalidProperties.dropdownValues = `Value at index ${index} must be a valid string`;
          return false;
        }
        if (parameterObject.defaultValue && !isDefaultValueInDropdown) {
          isDefaultValueInDropdown = parameterObject.defaultValue === value;
        }
        return true;
      });

      if (!valid) return;

      if (parameterObject.defaultValue && !isDefaultValueInDropdown) {
        this.invalidProperties.defaultValue = 'Must be a value that exists in dropdown values';
      } else {
        this.specificProperties = {
          dropdownValues: parameterObject.dropdownValues,
          defaultValue: parameterObject.defaultValue,
        };
        this.result = true;
      }
    }
  }

  _validateDropdownMultiple(parameterObject) {
    const defaultValuesInDropdown = [];
    if (parameterObject.defaultValue && !typeCommonValidator.validateArray(parameterObject.defaultValue)) {
      this.invalidProperties.defaultValue = 'Must be an array';
    } else if (!typeCommonValidator.validateArray(parameterObject.dropdownValues)) {
      this.invalidProperties.dropdownValues = 'Must be an array';
    } else if (parameterObject.dropdownValues
      && (new Set(parameterObject.dropdownValues)).size !== parameterObject.dropdownValues.length) {
      this.invalidProperties.dropdownValues = 'Parameter options should be unique';
    } else {
      const valid = parameterObject.dropdownValues.every((value, index) => {
        if (!typeCommonValidator.validateString(value)) {
          this.invalidProperties.dropdownValues = `Value at index ${index} must be a valid string`;
          return false;
        }

        if (parameterObject.defaultValue && parameterObject.defaultValue.includes(value)) {
          defaultValuesInDropdown.push(value);
        }
        return true;
      });

      if (!valid) return false;

      if (parameterObject.defaultValue && defaultValuesInDropdown.length < parameterObject.defaultValue.length) {
        this.invalidProperties.defaultValue = 'Must only have values that exist in dropdown values';
      } else {
        this.specificProperties = {
          dropdownValues: parameterObject.dropdownValues,
          defaultValue: parameterObject.defaultValue,
        };
        this.result = true;
      }
    }
  }

  _validateDateField(parameterObject) {
    if (parameterObject.defaultValue && (
      !typeCommonValidator.validateString(parameterObject.defaultValue, /^[\d]{1,2}\/[\d]{1,2}\/[\d]{4}$/)
        || !Date.parse(parameterObject.defaultValue)
    )) {
      this.invalidProperties.defaultValue = 'Must be a valid date having format MM/DD/YYYY';
    } else {
      this.specificProperties = {
        defaultValue: parameterObject.defaultValue,
      };
      this.result = true;
    }
  }

  _validateSwitch(parameterObject) {
    if (parameterObject.defaultValue && !typeCommonValidator.validateBoolean(parameterObject.defaultValue)) {
      this.invalidProperties.defaultValue = 'Must be a true/false boolean value';
    } else {
      this.specificProperties = {
        defaultValue: parameterObject.defaultValue,
      };
      this.result = true;
    }
  }

  validate(parameterObject) {
    const map = {
      inputBox: this._validateInputBox,
      dropdownSingle: this._validateDropdownSingle,
      dropdownMultiple: this._validateDropdownMultiple,
      dateField: this._validateDateField,
      switch: this._validateSwitch,
    };

    map[parameterObject.type].call(this, parameterObject);
    return this.result;
  }
}

module.exports = ParameterType;
