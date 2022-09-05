const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { UnauthorizedError } = require('../errors/errors');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Поле должно быть заполнено'],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Неправильный формат почты',
    },
  },
    password: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      select: false,
      },
    name: {
      type: String,
      minlength: [2, 'Минимальное количество букв в имени - 2'],
      maxlength: [30, 'Максимальное количество букв в имени - 30'],
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
  .select('+password')
  .then((user) => {
    if (!user) {
      throw new UnauthorizedError('Неправильная почта или пароль');
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new UnauthorizedError('Неправильная почта или пароль');
      }
        return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
