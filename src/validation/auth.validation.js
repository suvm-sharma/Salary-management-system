const Joi = require("@hapi/joi");

const registerUser = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        roleName: Joi.string(),
    }),
};

const login = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
};

module.exports = {
    registerUser,
    login,
};
