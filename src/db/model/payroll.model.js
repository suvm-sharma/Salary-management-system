const config = require("../../config/config");

module.exports = (sequelize, DataTypes) => {
    const payroll = sequelize.define(
        "payroll",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            employee_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            month: {
                type: DataTypes.STRING, // YYYY-MM
                allowNull: false,
            },
            gross_salary: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
            },
            tax: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0,
            },
            pf: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0,
            },
            other_deductions: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0,
            },
            net_salary: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
            },
        },
        {
            tableName: "payroll",
            timestamps: true,
            indexes: [{ unique: true, fields: ["employee_id", "month"] }],
        }
    );

    payroll.associate = (models) => {
        payroll.belongsTo(models.employee, {
            foreignKey: "employee_id",
        });
    };

    return payroll;
};
