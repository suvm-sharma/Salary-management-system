const config = require("../../config/config");

module.exports = (sequelize, DataTypes) => {
    const role = sequelize.define(
        "role",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            permissions: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                defaultValue: [],
            },
        },
        {
            /**
             * By default, sequelize will automatically transform all passed model names into plural
             * References: https://sequelize.org/master/manual/model-basics.html#table-name-inference
             */
            tableName: "role", // Keeps the table name as 'user' instead of 'users'
            timestamps: true,
        }
    );

    role.associate = (models) => {
        role.hasMany(models.user, {
            foreignKey: "role_id",
            onDelete: "CASCADE",
        });
    };

    return role;
};
