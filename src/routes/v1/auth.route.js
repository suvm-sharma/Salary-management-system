const express = require("express");
const validate = require("../../middleware/validate");
const authController = require("../../controllers/auth.controller");
const authValidation = require("../../validation/auth.validation");

const router = express.Router();

router.post(
    "/register",
    validate(authValidation.registerUser),
    authController.registerUser
);

router.post(
    "/login",
    validate(authValidation.login),
    authController.login
);

module.exports = router;
