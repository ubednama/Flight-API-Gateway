const express = require('express');
const { UserController } = require('../../controllers');
const { UserMiddleware } = require('../../middlewares');

const router = express.Router();

router.post('/signup', UserController.createUser)
router.post('/login', UserMiddleware.validateAuthRequest, UserController.login)

module.exports = router;