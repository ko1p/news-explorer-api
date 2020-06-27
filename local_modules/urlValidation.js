const validator = require('validator');
const BadRequest = require('../errors/badRequest');

const urlValidation = (value) => {
  if (!validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })) {
    throw new BadRequest('указан некорректный URL-адрес');
  }
  return value;
};

module.exports = urlValidation;
