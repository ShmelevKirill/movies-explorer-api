const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateRegistration } = require('../middlewares/validation');
const { errorNotFoundText } = require('../configs/constants');

router.post('/signin', validateLogin, login);
router.post('/signup', validateRegistration, createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use(() => {
  throw new NotFoundError(errorNotFoundText);
});

module.exports = router;
