const catchAsync = require("../utils/catchAsync");
const { roleService } = require("../services");
const { ApiResponse } = require("../utils/ApiResponse");

const registerRole = catchAsync(async (req, res) => {
    const role = await roleService.registerRole(req);
    return res
        .status(201)
        .json(new ApiResponse(200, role, "Role Registered Successfully !"));
});

module.exports = {
    registerRole,
};
