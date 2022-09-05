const express = require('express');
const { loginValidator, createUserValidator } = require('../utils/celebrateValidate');
const { login, createUser } = require('../controllers/users');
const { NotFoundError } = require('../errors/errors');
const auth = require('../middlewares/auth');

const router = express.Router();

router.use(express.json());

router.post(
  '/signin',
  loginValidator,
  login,
);

router.post(
  '/signup',
  createUserValidator,
  createUser,
);

router.use(auth);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
