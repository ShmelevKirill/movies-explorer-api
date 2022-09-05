const { DEFAULT } = require('../utils/constants');

const errorsHandler = (err, req, res, next) => {
  const { statusCode = DEFAULT, message} = err;
  res.status(statusCode).send({
    message: statusCode === DEFAULT ? 'на сервере произошла ошибка' : message,
  });
  next();
};

module.exports = { errorsHandler };