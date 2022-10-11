const { errorServerText } = require('../configs/constants');

const errorsHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? errorServerText
        : message,
    });

  next();
};

module.exports = {
  errorsHandler,
};
