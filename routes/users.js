const router = require('express').Router();
const { userInfoJoi } = require('../middlewares/validation');

const {
  editUserProfile, getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser); // возвращает информацию о пользователе (email и имя)
router.patch('/me', userInfoJoi, editUserProfile); // обновляет информацию о пользователе (email и имя)

module.exports = router;
