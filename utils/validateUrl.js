const validator = require('validator');
const { BadRequestError } = require('../errors/errors');

const validateUrl = (value) => {
  const result = validator.isURL(value);
  if (!result) {
    throw new BadRequestError('Некорректный адрес');
  }
  return value;
};

module.exports = { validateUrl };