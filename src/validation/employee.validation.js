const Joi = require("@hapi/joi");

const createEmployee = {
    body: Joi.object({
        user_id: Joi.number().required(),
        employee_code: Joi.string().required(),
        joining_date: Joi.date().required(),
        department: Joi.string(),
        designation: Joi.string(),
        base_salary: Joi.number().required(),
        hra: Joi.number(),
        allowances: Joi.number(),
        working_days_per_month: Joi.number(),
        pf_rate: Joi.number(),
    }),
};

const getEmployee = {
    params: Joi.object({
        employeeId: Joi.number().required(),
    }),
};

module.exports = {
    createEmployee,
    getEmployee,
};
