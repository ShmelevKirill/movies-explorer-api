const Movie = require('../models/movie');
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require('../errors/errors');

module.exports.getMovies = async (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch(next);
};

module.exports.addMovie = async (req, res, next) => {
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

  Movie.create({
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
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = async (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм не найден');
    })
    .then((deleteMovie) => {
      if (deleteMovie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить фильм, добавленный не вами');
      }
      return Movie.findByIdAndDelete(req.params.movieId)
        .then((movie) => {
          res.send({
            country: movie.country,
            director: movie.director,
            duration: movie.duration,
            year: movie.year,
            description: movie.description,
            image: movie.image,
            trailerLink: movie.trailerLink,
            nameRU: movie.nameRU,
            nameEN: movie.nameEN,
            thumbnail: movie.thumbnail,
            movieId: movie.movieId,
            _id: movie._id,
          });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан неккоректный id фильма'));
      } else {
        next(err);
      }
    });
};
