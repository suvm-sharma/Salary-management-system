const express = require("express");

const authRoute = require("./auth.route");
const employeeRoute = require("./employee.route");
const roleRoute = require("./role.route");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/employee", employeeRoute);
router.use("/roles", roleRoute);

module.exports = router;
