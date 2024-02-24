const express = require("express");

const userController = require('../controllers/user');

const router = express.Router();

router.post('/user/signUp',userController.signUp);
router.post('/user/login',userController.login);

module.exports = router;
