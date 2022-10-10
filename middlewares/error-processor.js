const {
  SERVER_ERROR,
} = require('../utils/constants');

module.exports.errorProcessor = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
