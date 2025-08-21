const config = require("../../config/config");

module.exports = (sequelize, DataTypes) => {
    const attendance = sequelize.define(
        "attendance",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            employee_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            hours_worked: {
                type: DataTypes.DECIMAL(5, 2),
            },
            status: {
                type: DataTypes.ENUM("FULL", "HALF", "ABSENT"),
                allowNull: false,
            },
            notes: {
                type: DataTypes.TEXT,
            },
        },
        {
            tableName: "attendance",
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ["employee_id", "date"],
                },
            ],
        }
    );

    attendance.associate = (models) => {
        attendance.belongsTo(models.employee, {
            foreignKey: "employee_id",
        });
    };

    return attendance;
};
