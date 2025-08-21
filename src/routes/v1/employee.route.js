const express = require("express");
const validate = require("../../middleware/validate");
const employeeController = require("../../controllers/employee.controller");
const employeeValidation = require("../../validation/employee.validation");
const { authMiddleware } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware("manageEmployees"),
    validate(employeeValidation.createEmployee),
    employeeController.createEmployee
);

router.get(
    "/:employeeId",
    authMiddleware("selfGetProfile"),
    validate(employeeValidation.getEmployee),
    employeeController.getEmployee
);

module.exports = router;
