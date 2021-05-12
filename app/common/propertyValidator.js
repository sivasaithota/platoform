class PropertyValidator {
  /**
   * Creates a new validator object based on the provided schema and options
   * @param {object} schema Validation schema for validating objects
   * @param {object} options Validation options
   * @param {boolean} options.ignoreRequired Ignore 'isRequired' schema property during validation
   */
  constructor(schema, options = { ignoreRequired: false }) {
    const { ignoreRequired } = options;

    this._schema = schema;
    this._ignoreRequired = ignoreRequired;
  }

  /**
   * Common function that through the list of validations, checking if the validation method fails, and assigning error message
   * @param {string} name Property name
   * @param {*} value Property value
   * @param {object[]} validationList
   * @param {function(object):boolean} validationList[].method Method against which the property is to be validated
   * @param {string} validationList[].message Message to be assigned when validation fails
   */
  _runPropertyValidations(name, value, validationList) {
    const invalidProperties = {};

    // If any of the validation methods fails, store the message against name of invalid property and set isValid as false
    if (!validationList.every((validation) => {
      if (!validation.method(value)) {
        invalidProperties[name] = validation.message;
        return false;
      }
      return true;
    })) {
      return { isValid: false, invalidProperties };
    }

    return { isValid: true };
  }

  /**
   * Validates an object based on the validator schema
   * @param {*} object Object to be validated
   */
  validate(object) {
    const { _schema, _ignoreRequired } = this;
    const validatedObject = {};
    const invalidProperties = {};

    const isValid = Object.keys(_schema).every((propertyName) => {
      // If property does not exist in object, it can be skipped if schema has no isRequired or requiredWhen, or if ignoreRequired is true
      if (object[propertyName] == null && (_ignoreRequired || !(
        _schema[propertyName].isRequired || (_schema[propertyName].requiredWhen && _schema[propertyName].requiredWhen(object))
      ))) {
        if (_schema[propertyName].default) validatedObject[propertyName] = _schema[propertyName].default;
        return true;
      }

      // If property schema contains any validations, runs the validations and return false if any validation fails
      if (_schema[propertyName].validations) {
        const validationResult = this._runPropertyValidations(propertyName, object[propertyName], _schema[propertyName].validations);
        if (!validationResult.isValid) {
          Object.assign(invalidProperties, validationResult.invalidProperties);
          return false;
        }
      }

      // If schema indicates that a property is an object, creates a new validator for that object to validate its own properties
      if (_schema[propertyName].isObject) {
        const propertyValidation = new PropertyValidator(_schema[propertyName].properties).validate(object[propertyName]);
        // If any of these sub-properties is invalid, stores the error message and returns false
        if (!propertyValidation.isValid) {
          invalidProperties[propertyName] = propertyValidation.invalidProperties;
          return false;
        }
        validatedObject[propertyName] = propertyValidation.validatedObject;
      }

      // If schema indicates that a property is an array of objects, creates a new validator and runs validation for every element
      if (_schema[propertyName].isArray) {
        validatedObject[propertyName] = [];
        if (!object[propertyName].every((element, index) => {
          const elementValidation = new PropertyValidator(_schema[propertyName].properties).validate(element);
          if (!elementValidation.isValid) {
            invalidProperties[propertyName] = { [index]: elementValidation.invalidProperties };
            return false;
          }
          validatedObject[propertyName].push(elementValidation.validatedObject);
          return true;
        })) {
          return false;
        }
      }

      // If specified, runs validations to be an object or array property once all its sub-properties or elements are validated
      if (_schema[propertyName].postValidations) {
        const validationResult = this._runPropertyValidations(propertyName, object[propertyName], _schema[propertyName].postValidations);
        if (!validationResult.isValid) {
          Object.assign(invalidProperties, validationResult.invalidProperties);
          return false;
        }
      }
      validatedObject[propertyName] = validatedObject[propertyName] || object[propertyName];
      return true;
    });

    return { isValid, invalidProperties, validatedObject };
  }
}

module.exports = PropertyValidator;
