const Joi = require("@hapi/joi");

const registerRoleSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        permissions: Joi.array().items(Joi.string()).default([]),
    }),
};

module.exports = {
    registerRoleSchema,
};
