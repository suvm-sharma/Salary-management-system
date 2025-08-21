const { employeeService } = require("../services");
const { ApiResponse } = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");

const createEmployee = catchAsync(async (req, res) => {
    const employee = await employeeService.registerEmployee(req);
    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                employee,
                "Employee registered Scuccessfully !"
            )
        );
});

const getEmployee = catchAsync(async (req, res) => {
    const employee = await employeeService.getEmployee(req);
    return res
        .status(200)
        .json(
            new ApiResponse(200, employee, "Employee retrieved Scuccessfully !")
        );
});

module.exports = {
    createEmployee,
    getEmployee,
};
