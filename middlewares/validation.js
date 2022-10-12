const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const { errorCustomText } = require('../configs/constants');

const validateUrl = (value, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.message(errorCustomText);
};

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateMovieInfo = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().length(4),
    description: Joi.string().required(),
    image: Joi.object().required(),
    trailerLink: Joi.string().custom(validateUrl),
    id: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string(),
  }).unknown(),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  validateLogin,
  validateRegistration,
  validateUserInfo,
  validateMovieInfo,
  validateMovieId,
};
