const express = require('express');

const userRouters = require('./user.routes')

const { InfoController } = require('../../controllers');
const { UserMiddleware } = require('../../middlewares');

const router = express.Router();

router.get('/info', UserMiddleware.authUser, InfoController.info);

router.use('/', userRouters)

module.exports = router;