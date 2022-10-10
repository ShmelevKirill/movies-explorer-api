const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const checkURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Это не похоже на ссылку!');
};

module.exports.usersJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.loginJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.userInfoJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

module.exports.moviesJoi = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(checkURL),
    trailerLink: Joi.string().required().custom(checkURL),
    thumbnail: Joi.string().required().custom(checkURL),
    movieId: Joi.number().integer().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.movieIdJoi = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
});
