const config = require("../../config/config");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define(
        "user",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role_id: {
                type: DataTypes.INTEGER,
            },
            is_admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            last_login_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            /**
             * By default, sequelize will automatically transform all passed model names into plural
             * References: https://sequelize.org/master/manual/model-basics.html#table-name-inference
             */
            tableName: "user", // Keeps the table name as 'user' instead of 'users'
            timestamps: true,
        }
    );

    user.associate = (models) => {
        user.belongsTo(models.role, {
            foreignKey: "role_id",
        });
        user.hasOne(models.employee, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
        user.hasMany(models.token, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
    };

    // pre hook
    user.beforeCreate(async (user) => {
        if (user.password) {
            const saltRounds = config.bcrypt.saltRounds;
            user.password = await bcrypt.hash(user.password, saltRounds);
        }
    });

    return user;
};
