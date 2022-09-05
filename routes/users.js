const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

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
