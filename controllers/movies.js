const Movie = require('../models/movie');
const { CREATED_CODE } = require('../utils/constants');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const RequestError = require('../errors/request-err');

// возвращает все сохранённые текущим  пользователем фильмы
// GET /movies
module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailerLink,
// nameRU, nameEN, thumbnail, movieId
// POST /movies
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(CREATED_CODE).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(err.message));
      } else {
        next(err);
      }
    });
};

// удаляет сохранённый фильм по id
// DELETE /movies/_id
module.exports.delMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError('Фильм не найден');
    })
    .then((foundMovie) => {
      if (foundMovie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Удалить можно только сохраненный фильм');
      }
      return Movie.deleteOne(foundMovie).then(() => res.send(foundMovie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Данные введены неверно'));
      } else {
        next(err);
      }
    });
};
