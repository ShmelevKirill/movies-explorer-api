const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NotFoundError, BadRequestError, ConflictError,
} = require('../errors/errors');

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ message: token });
    })
    .catch(next);
};

module.exports.getCurrentUser = async (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, email, password: hash })
      .then((user) => {
        res.send({
          name: user.name,
          email: user.email,
          _id: user._id,
        });
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы неккоректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      if (user._id.toString() !== req.user._id) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      if (user.name === name) {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      }
      return User.findByIdAndUpdate(req.user._id, {
        name,
        email,
      }, {
        new: true,
        runValidators: true,
      })
        .then((updateUser) => {
          res.send({
            name: updateUser.name,
            email: updateUser.email,
          });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы неккоректные данные при обновлении пользователя'));
      } else {
        next(err);
      }
    });
};
