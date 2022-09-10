const express = require('express');
const router = require('express').Router();
const {
  addMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

const { addMovieValidator, delMovieValidator } = require('../utils/celebrateValidate');

router.get('/', getMovies);

router.post(
  '/',
  express.json(),
  addMovieValidator,
  addMovie,
);

router.delete(
  '/:movieId',
  delMovieValidator,
  deleteMovie,
);

module.exports = router;
