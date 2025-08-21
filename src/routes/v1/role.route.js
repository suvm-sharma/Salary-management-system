const express = require("express");
const validate = require("../../middleware/validate");
const { registerRoleSchema } = require("../../validation/role.validation");
const roleController = require("../../controllers/role.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");

const router = express.Router();

router
    .route("/")
    .post(
        authMiddleware("manageRoles"),
        validate(registerRoleSchema),
        roleController.registerRole
    );

module.exports = router;
