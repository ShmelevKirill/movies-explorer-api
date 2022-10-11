const { celebrate, Joi } = require('celebrate');
const { validateUrl } = require('../validateUrl');

const saveMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().length(4),
    description: Joi.string().required(),
    image: Joi.object().required(),
    trailerLink: Joi.string().required().custom(validateUrl),
    id: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = { saveMovieValidator };
