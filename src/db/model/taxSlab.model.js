const config = require("../../config/config");

module.exports = (sequelize, DataTypes) => {
    const taxSlab = sequelize.define(
        "tax_slab",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            min_inclusive: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
            },
            max_exclusive: {
                type: DataTypes.DECIMAL(12, 2),
            },
            rate: {
                type: DataTypes.DECIMAL(5, 4), // 0.05 = 5%
                allowNull: false,
            },
        },
        {
            tableName: "tax_slab",
            timestamps: true,
        }
    );

    return taxSlab;
};
