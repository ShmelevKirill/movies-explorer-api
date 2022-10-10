const bcrypt = require('bcryptjs');

const User = require('../models/user');

const { generateToken } = require('../utils/jwt');

const {
  CREATED_CODE,
} = require('../utils/constants');

const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');
const ConflictError = require('../errors/conflict-err');
const RequestError = require('../errors/request-err');

// возвращает информацию о пользователе (email и имя)
// GET /users/me
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// создаёт пользователя с переданными в теле
// email, password и name
// POST /signup
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email }) // ищем пользователя, чтобы лишний раз не хешировать пароль
    .then((found) => {
      if (found) { throw new ConflictError('Такой email уже занят'); }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, email, password: hash,
        }))
        .then((user) => {
          const noPassUser = {
            name: user.name,
            email: user.email,
            _id: user._id,
          };
          res.status(CREATED_CODE).send(noPassUser);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой email уже занят'));
      } else { next(err); }
    });
};

// # проверяет переданные в теле почту и пароль
// # и возвращает JWT
// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((foundUser) => {
      if (!foundUser) {
        throw new AuthError('Неверный email или пароль');
      }
      return bcrypt.compare(password, foundUser.password)
        .then((isPasswordCorrect) => {
          if (!isPasswordCorrect) {
            throw new AuthError('Неверный email или пароль');
          }
          const token = generateToken({ _id: foundUser._id });

          res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: 'none',
              secure: true,
            })
            .send({ message: 'Авторизация прошла успешно' });
        });
    })
    .catch(next);
};

// POST /signout. При запросе к роуту удалится JWT из куков пользователя.
module.exports.signout = (req, res, next) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })
    .send({ message: 'Пока-пока!' })
    .catch(next);
};

// обновляет информацию о пользователе (email и имя)
// PATCH /users/me
module.exports.editUserProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true,
    },
  ).orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой email уже занят'));
      } else { next(err); }
    });
};
