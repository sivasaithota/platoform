const express = require('express');

class Base extends express.Router {
  constructor() {
    super({ mergeParams: true });
  }
}

module.exports = Base;
