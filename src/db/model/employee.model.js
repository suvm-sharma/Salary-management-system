module.exports = (sequelize, DataTypes) => {
    const employee = sequelize.define(
        "employee",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            employee_code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            joining_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            department: {
                type: DataTypes.STRING,
            },
            designation: {
                type: DataTypes.STRING,
            },
            base_salary: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
            },
            hra: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0,
            },
            allowances: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0,
            },
            working_days_per_month: {
                type: DataTypes.INTEGER,
                defaultValue: 26,
            },
            pf_rate: {
                type: DataTypes.DECIMAL(5, 4),
                defaultValue: 0.12,
            },
        },
        {
            tableName: "employee",
            timestamps: true,
        }
    );

    employee.associate = (models) => {
        employee.belongsTo(models.user, {
            foreignKey: "user_id",
        });
        employee.hasMany(models.attendance, {
            foreignKey: "employee_id",
            onDelete: "CASCADE",
        });
        employee.hasMany(models.payroll, {
            foreignKey: "employee_id",
            onDelete: "CASCADE",
        });
    };

    return employee;
};
