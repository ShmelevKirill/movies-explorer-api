const router = require('express').Router();

const {
  getCurrentUser,
  updateUserInfo,
} = require('../controllers/users');

const { updateUserValidator } = require('../utils/celebrateValidate');

router.get('/me', getCurrentUser);

router.patch(
  '/me',
  updateUserValidator,
  updateUserInfo,
);

module.exports = router;
