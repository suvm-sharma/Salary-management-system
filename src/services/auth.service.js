const ApiError = require("../utils/ApiError");
const db = require("../db/model");
const { validatePassword } = require("../middleware/auth.middleware");

async function registerUser(req) {
    try {
        const { email, roleName } = req.body;
        const isEmailTaken = await db.user.findOne({
            where: {
                email,
            },
        });

        if (isEmailTaken) {
            throw new ApiError(400, "Email is already in use !");
        }

        const role = await db.role.findOne({
            where: {
                title: roleName.toLowerCase(),
            },
        });

        if (isEmailTaken === null) {
            const user = await db.user.create({
                ...req.body,
                role_id: role.id,
            });

            return user;
        }
    } catch (error) {
        console.log("error --", error);
    }
}

async function loginUser(req) {
    try {
        const { email, password } = req.body;

        const user = await db.user.findOne({ where: { email } });

        if (!user) {
            throw new ApiError(400, "No user found with this email !");
        }

        const isMatch = await validatePassword(password, user.password);
        if (!isMatch) {
            throw new ApiError(400, "Invalid Credentials !");
        }

        return user;
    } catch (error) {
        console.log("error --", error);
        throw error;
    }
}

module.exports = { registerUser, loginUser };
