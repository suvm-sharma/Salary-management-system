const { authService } = require("../services");
const { ApiResponse } = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");
const authMiddleware = require("../middleware/auth.middleware");

const registerUser = catchAsync(async (req, res) => {
    const user = await authService.registerUser(req);
    return res
        .status(201)
        .json(new ApiResponse(201, user, "User registered Scuccessfully !"));
});

const login = catchAsync(async (req, res) => {
    const user = await authService.loginUser(req);
    const tokens = await authMiddleware.generateAuthTokens(user);
    return res
        .status(201)
        .json(new ApiResponse(200, { user, tokens }, "Login Successful !"));
});

module.exports = {
    registerUser,
    login,
};
