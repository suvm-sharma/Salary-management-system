const ApiError = require("../utils/ApiError");
const db = require("../db/model");

async function registerRole(req) {
    try {
        const { title, permissions } = req.body;

        if (!title) {
            throw new ApiError(400, "Please provide role");
        }

        const role = await db.role.create({
            title,
            permissions,
        });

        return role;
    } catch (error) {
        console.log("error --", error);
    }
}

module.exports = { registerRole };
