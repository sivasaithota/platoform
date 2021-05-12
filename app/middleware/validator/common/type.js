class Type {
  validateString(value, regExp = /^.+$/) {
    return value != null && value.constructor === String && regExp.test(value);
  }

  validateDateString(value) {
    return value != null && value.constructor === String && new Date(value).toISOString().startsWith(value);
  }

  validateBoolean(value) {
    return value != null && value.constructor === Boolean;
  }

  validateNumber(value, isInteger = false, minVal = -Infinity, maxVal = Infinity) {
    return value != null && typeof value === 'number' && !(isInteger && value % 1 > 0) && (minVal <= value && value <= maxVal);
  }

  validateArray(value, minLength = 0) {
    return value != null && Array.isArray(value) && value.length >= minLength;
  }

  validateObjectId(value) {
    return this.validateString(value, /^[a-fA-F0-9]{24}$/);
  }

  validateObject(value, allowEmpty = false) {
    return value != null && value.constructor === Object && (allowEmpty || Object.entries(value).length > 0);
  }
}

module.exports = new Type();
