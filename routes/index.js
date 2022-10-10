const router = require('express').Router();
const { loginJoi, usersJoi } = require('../middlewares/validation');
const NotFoundError = require('../errors/not-found-err');

const { auth } = require('../middlewares/auth');
const { login, signout, createUser } = require('../controllers/users');

router.post('/signin', loginJoi, login);
router.post('/signup', usersJoi, createUser);

router.use(auth);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('/signout', signout);

router.use(() => {
  throw new NotFoundError('Нет такого покемона');
});

module.exports = router;
