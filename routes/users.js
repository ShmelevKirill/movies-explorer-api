const express = require('express');

const router = require('express').Router();
const { validateUserInfo } = require('../middlewares/validation');

const {
  getUser,
  updateUserInfo,
} = require('../controllers/users');

router.get('/me', getUser);

router.patch('/me', validateUserInfo, updateUserInfo);

module.exports = router;
