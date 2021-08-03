const validator = require('validator');

const urlValidator = (value) => {
  const result = validator.isURL(value, { require_protocol: true });
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

module.exports = urlValidator;