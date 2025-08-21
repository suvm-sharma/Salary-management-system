const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

module.exports = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 2000,
    pagination: {
        limit: 10,
        page: 1,
    },
    jwt: {
        secret: process.env.JWT_SECRET || "your_jwt_secret",
        accessExpirationMinutes:
            process.env.JWT_ACCESS_EXPIRATION_MINUTES || 30,
        refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS || 30,
        resetPasswordExpirationMinutes:
            process.env.RESET_PASSWORD_EXPIRATION_MINUTES || 10,
    },
    cookie: {
        cookieExpirationHours: 24,
    },
    sqlDB: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        dialect: "postgres", // since you’re using PostgreSQL
        pool: {
            max: 10,
            idle: 30000,
        },
        define: {
            timestamps: true,
            freezeTableName: true, // disables plural table names
            underscored: true, // uses snake_case for columns
        },
    },
    bcrypt: {
        saltRounds: parseInt(process.env.SALT, 10) || 10,
    },
};
