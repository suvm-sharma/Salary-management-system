const ApiError = require("../utils/ApiError");
const db = require("../db/model");

async function registerEmployee(req) {
    try {
        const { user_id } = req.body;

        // from front-end i need to get user_id because if name is sent in paylod i will not able to find the excat user.

        // Find with the user_id that is already exist in db
        const isExist = await db.employee.findOne({
            where: {
                user_id,
            },
        });

        if (isExist) {
            throw new ApiError(400, "Employee already exist");
        }

        const employee = await db.employee.create({
            ...req.body,
        });

        return employee;
    } catch (error) {
        console.log("error --", error);
    }
}

async function getEmployee(req) {
    try {
        const { employeeId } = req.params;

        // Find with the user_id that is already exist in db
        const employee = await db.employee.findByPk(employeeId, {
            include: [
                {
                    model: db.user,
                    attributes: { exclude: ["password"] },
                },
            ],
        });

        if (!employee) {
            throw new ApiError(400, "No Employee Found");
        }

        return employee;
    } catch (error) {
        console.log("error --", error);
    }
}

module.exports = { registerEmployee, getEmployee };
