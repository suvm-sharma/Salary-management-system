const tokenTypes = require("../../config/constant");

module.exports = (sequelize, DataTypes) => {
    const token = sequelize.define(
        "token",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM(
                    tokenTypes.REFRESH,
                    tokenTypes.RESET_PASSWORD,
                    tokenTypes.VERIFY_EMAIL
                ),
                allowNull: false,
            },
            expires: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            blacklisted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: "token",
            timestamps: true,
            indexes: [{ fields: ["token"] }],
        }
    );

    token.associate = (models) => {
        token.belongsTo(models.user, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
    };

    return token;
};
