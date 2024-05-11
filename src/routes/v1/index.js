const express = require('express');

const userRouters = require('./user.routes')

const { InfoController } = require('../../controllers');

const router = express.Router();

router.get('/info', InfoController.info);

router.use('/', userRouters)

module.exports = router;