const Movie = require('../models/movie');
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require('../errors/errors');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    return res.send(movies);
  } catch (err) {
    next(err);
  }
};

module.exports.addMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: req.user._id,
      movieId,
      nameRU,
      nameEN, });
    return res.send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError(
          'Переданы некорректные данные',
        ),
      );
    }
    next(err);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const card = await Movie.findById(req.params.movieId)
      .orFail(new NotFoundError('Фильм не найден'));
    if (!movie.owner.equals(req.user._id)) {
      throw new ForbiddenError('Нельзя удалить фильм, добавленный не вами');
    }
    await Movie.deleteOne(movie);
    return res.send(movie);
  } catch (err) {
    next(err);
  }
};
