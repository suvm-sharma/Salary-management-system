var jwt = require("jsonwebtoken");
const httpStatus = require("http-status"); // For HTTP status codes
const ApiError = require("../utils/ApiError"); // Adjust path as per your project structure
const catchAsync = require("../utils/catchAsync");
const config = require("../config/config"); // Adjust path to your config file (for jwt.secret)
const bcrypt = require("bcrypt");
const db = require("../db/model");
const tokenTypes = require("../config/constant");
const tokenService = require("../services");
const moment = require("moment");
const { roleRights } = require("../config/roles");

/**
 * JWT authentication and role-based authorization middleware for staff members.
 * It extracts, verifies, and decodes the JWT, then attaches the staff data to the request.
 * It also checks for required rights based on the staff's role, including a super admin bypass.
 *
 * @param {...string} requiredRights - An array of strings representing the rights required to access the route.
 * @returns {Function} An Express middleware function.
 */

/*
const authMiddleware = (...requiredRights) =>
    catchAsync(async (req, _res, next) => {
        // 1. Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(
                new ApiError(
                    httpStatus.UNAUTHORIZED,
                    "Please authenticate: No token provided or invalid format."
                )
            );
        }

        const token = authHeader.split(" ")[1]; // Get the token part after 'Bearer '

        if (!token) {
            return next(
                new ApiError(
                    httpStatus.UNAUTHORIZED,
                    "Please authenticate: Token is missing."
                )
            );
        }

        let decoded;
        try {
            // 2. Verify and decode the token
            // Ensure config.jwt.secret holds your JWT secret key.
            decoded = jwt.verify(token, config.jwt.secret);
        } catch (error) {
            // Handle specific JWT errors (e.g., token expired, invalid signature)
            if (error instanceof jwt.JsonWebTokenError) {
                return next(
                    new ApiError(
                        httpStatus.UNAUTHORIZED,
                        `Authentication failed: ${error.message}`
                    )
                );
            }

            // Catch any other unexpected errors during verification
            return next(
                new ApiError(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    "Authentication failed: An unexpected error occurred."
                )
            );
        }

        // 3. Attach staff information to the request object
        // You might fetch the staff from your database here to ensure they still exist and are active.
        // For example: const staff = await db.staff.findByPk(decoded.id);
        // For now, we'll assume the decoded token directly contains sufficient staff info,
        // matching the IStaffDoc properties needed for subsequent checks.
        // It's crucial that your token payload matches the expected structure.
        const user = {
            id: decoded.id,
            is_admin: decoded.is_admin,
            role_id: decoded.role_id,
            email: decoded.email,
            is_active: decoded.is_active,
        };

        // Attach the staff object to the request.
        // This is necessary for downstream middleware/route handlers to access authenticated staff details.
        req.user = user;

        console.log("requiredRights--->", requiredRights);

        // 4. Implement Super Admin and Profile Bypass
        // If user is admin or the route requires 'profile' right, immediately resolve.
        if (user.is_admin) {
            return next();
        }

        // 5. Perform Authorization Checks (Role-based access control)
        if (requiredRights.length) {
            // Fetch the role document from the database to get its permissions.
            // Assumes user.role is an ID that can be used with Role.findById.
            const role = await db.role.findByPk(user.role_id);

            // If the role linked to the staff member does not exist, deny access.
            if (!role) {
                return next(
                    new ApiError(
                        httpStatus.UNAUTHORIZED,
                        "Invalid role assigned to user."
                    )
                );
            }

            const userRights = roleRights.get(role.title);

            if (!userRights)
                return next(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));

            const hasRequiredRights = requiredRights.every((requiredRight) =>
                userRights.includes(requiredRight)
            );

            if (!hasRequiredRights && req.params["userId"] !== user.id) {
                return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
            }

            const rolePermission = role.permissions;

            // Extract the permissions array from the role document.
            const userRights = rolePermission;

            // If the role has no defined permissions, deny access.
            if (!userRights) {
                return next(
                    new ApiError(
                        httpStatus.FORBIDDEN,
                        "Forbidden: Staff role has no defined permissions."
                    )
                );
            }

            // Check if the user member possesses ALL the `requiredRights` for the route.
            const hasRequiredRights = requiredRights.every((requiredRight) =>
                userRights.includes(requiredRight)
            );

            // Additional check for ownership: Allow staff to access their own data
            // even if they don't have broader permissions for a resource.
            // This checks if a 'staffId' route parameter exists and matches the authenticated staff's ID.

            // Ownership check
            let isOwner = false;
            for (const [key, value] of Object.entries(req.params)) {
                if (
                    key.toLowerCase().endsWith("id") &&
                    String(value) === String(user.id)
                ) {
                    isOwner = true;
                    break;
                }
            }

            if (!hasRequiredRights && !isOwner) {
                return next(
                    new ApiError(
                        httpStatus.FORBIDDEN,
                        "Forbidden: Insufficient rights or not resource owner."
                    )
                );
            }
        }

        // If all checks pass, proceed to the next middleware/route handler.
        next();
    });
*/

const authMiddleware = (...requiredRights) =>
    catchAsync(async (req, _res, next) => {
        // 1. Extract token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(
                new ApiError(
                    httpStatus.UNAUTHORIZED,
                    "Please authenticate: No token provided or invalid format."
                )
            );
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return next(
                new ApiError(
                    httpStatus.UNAUTHORIZED,
                    "Please authenticate: Token is missing."
                )
            );
        }

        // 2. Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt.secret);
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return next(
                    new ApiError(
                        httpStatus.UNAUTHORIZED,
                        `Authentication failed: ${error.message}`
                    )
                );
            }
            return next(
                new ApiError(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    "Authentication failed: An unexpected error occurred."
                )
            );
        }

        // 3. Attach user to request
        const user = {
            id: decoded?.user?.id,
            is_admin: decoded?.user?.is_admin,
            role_id: decoded?.user?.role_id ?? null,
            email: decoded?.user?.email,
            is_active: decoded?.user?.is_active,
        };

        req.user = user;

        // 4. Admin bypass
        if (user.is_admin) {
            return next();
        }

        // 5. Role-based permission check
        if (requiredRights.length) {
            const role = await db.role.findByPk(user.role_id);

            if (!role) {
                return next(
                    new ApiError(
                        httpStatus.UNAUTHORIZED,
                        "Invalid role assigned to user."
                    )
                );
            }

            const userRights = role.permissions;

            if (!userRights || !Array.isArray(userRights)) {
                return next(
                    new ApiError(
                        httpStatus.FORBIDDEN,
                        "Forbidden: Staff role has no defined permissions."
                    )
                );
            }

            const hasRequiredRights = requiredRights.every((requiredRight) =>
                userRights.includes(requiredRight)
            );

            // 6. Ownership check (handles both /users/:userId and /employee/:employeeId)
            const resourceOwnerId =
                (req.params && req.params.userId) || req.params.employeeId;

            const isOwner =
                resourceOwnerId && String(resourceOwnerId) === String(user.id);

            if (!hasRequiredRights && !isOwner) {
                return next(
                    new ApiError(
                        httpStatus.FORBIDDEN,
                        "Forbidden: Insufficient rights or not resource owner."
                    )
                );
            }
        }

        // 7. Allow request through
        next();
    });

async function generateAccessToken(payload, secret = config.jwt.secret, type) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            secret,
            type,
            { expiresIn: config.jwt.accessExpirationMinutes },
            (err, token) => {
                if (err) {
                    return reject(
                        new ApiError(400, "Error generating access token!")
                    );
                }
                resolve(token);
            }
        );
    });
}

/*
async function validatePassword(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.log("error --", error);
        throw new ApiError(400, "Getting error from validation password !");
    }
}

async function generateRefreshToken(payload, type, secret = config.jwt.secret) {
    try {
        const token = jwt.sign(
            payload,
            secret,
            {
                expiresIn: config.jwt.refreshExpirationDays,
            },
            type
        );
        return token;
    } catch (error) {
        console.error("Error--", error);
        throw new ApiError(400, "Getting error from refresh token !");
    }
}

async function generateAuthTokens(user) {
    try {
        const accessTokenExpires =
            (config.jwt.accessExpirationMinutes, "minutes");
        const accessToken = generateAccessToken(user.id, tokenTypes.ACCESS);
        const refreshTokenExpires = (config.jwt.refreshExpirationDays, "days");
        const refreshToken = generateRefreshToken(user.id, tokenTypes.REFRESH);
        await saveToken(
            refreshToken,
            user.id,
            refreshTokenExpires,
            tokenTypes.REFRESH
        );

        return {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshTokenExpires.toDate(),
            },
        };
    } catch (error) {
        console.log("Error --", error);
    }
}

module.exports = {
    authMiddleware,
    validatePassword,
    generateAccessToken,
    generateRefreshToken,
    generateAuthTokens,
};

*/

// Generate Access Token
async function generateAccessToken(user, type, secret = config.jwt.secret) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { user, type },
            secret,
            { expiresIn: `${config.jwt.accessExpirationMinutes}m` },
            (err, token) => {
                if (err) {
                    return reject(
                        new ApiError(400, "Error generating access token!")
                    );
                }
                resolve(token);
            }
        );
    });
}

// Validate password
async function validatePassword(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.log("error --", error);
        throw new ApiError(400, "Getting error from validation password!");
    }
}

async function saveToken(token, user_id, type, expires, blacklisted = false) {
    const tokenDoc = await db.token.create({
        token,
        user_id,
        expires,
        type,
        blacklisted,
    });

    return tokenDoc;
}

// Generate Refresh Token
async function generateRefreshToken(payload, type, secret = config.jwt.secret) {
    try {
        const token = jwt.sign({ id: payload, type }, secret, {
            expiresIn: `${config.jwt.refreshExpirationDays}d`,
        });
        return token;
    } catch (error) {
        console.error("Error--", error);
        throw new ApiError(400, "Getting error from refresh token!");
    }
}

// Generate Auth Tokens
async function generateAuthTokens(user) {
    try {
        const userObj = {
            id: user.id,
            is_admin: user.is_admin,
            role_id: user.role_id,
            email: user.email,
            is_active: user.is_active,
            last_login_at: user.last_login_at,
        };

        const accessTokenExpires = moment().add(
            config.jwt.accessExpirationMinutes,
            "minutes"
        );
        const accessToken = await generateAccessToken(
            userObj,
            tokenTypes.ACCESS
        );

        const refreshTokenExpires = moment().add(
            config.jwt.refreshExpirationDays,
            "days"
        );
        const refreshToken = await generateRefreshToken(
            user.id,
            tokenTypes.REFRESH
        );

        await saveToken(
            refreshToken,
            user.id,
            tokenTypes.REFRESH,
            refreshTokenExpires
        );

        return {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshTokenExpires.toDate(),
            },
        };
    } catch (error) {
        console.log("Error --", error);
        throw new ApiError(400, "Error generating auth tokens!");
    }
}

module.exports = {
    authMiddleware,
    generateAccessToken,
    generateRefreshToken,
    generateAuthTokens,
    validatePassword,
};
