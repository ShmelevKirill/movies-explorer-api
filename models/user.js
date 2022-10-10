const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Слишком короткое имя. Нужно минимум 2 символа.'],
    maxlength: [30, 'Слишком длинное имя. Должно быть не длиннее 30 символов.'],
    default: 'Елена',
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'Email занят'],
    validate: {
      validator(v) {
        return /.+@.+\..+/i.test(v);
      },
      message: (props) => `${props.value} не похоже на email!`,
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
    minlength: 8,
  },
});

module.exports = mongoose.model('user', userSchema);
