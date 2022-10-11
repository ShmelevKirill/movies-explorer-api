const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwtSign = require('../helpers/jwt-sign');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const EmailConflictError = require('../errors/email-conflict-err');
const {
  errorIncorrectDataText, errorEmailText, errorUserText, errorDataText,
} = require('../configs/constants');

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    })
      .then((user) => {
        res.send(user);
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(errorIncorrectDataText));
        return;
      }
      if (err.code === 11000) {
        next(new EmailConflictError(errorEmailText));
        return;
      }

      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwtSign(user._id);
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(errorUserText);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(errorDataText));
        return;
      }
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(errorUserText);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError(errorDataText));
        return;
      }
      if (err.code === 11000) {
        next(new EmailConflictError(errorEmailText));
        return;
      }
      next(err);
    });
};
