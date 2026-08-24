const express = require("express");
const userController = require('../controller/authController');
const router = express.Router();

router.post('/login',userController.login);
router.post('/register',userController.register);
router.post("/verify-register",userController.verifyRegister);
router.post("/forgot-password", userController.forget);
router.post("/verify-code", userController.verifyCode);
router.post("/reset-password", userController.resetPassword);

module.exports = router;