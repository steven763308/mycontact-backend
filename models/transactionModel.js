const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Ewallet = sequelize.define('Ewallet', {
        wallet_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            validate: {
                notNull: { msg: 'User ID is required' }
            }
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            validate: {
                notNull: { msg: 'Balance is required' },
                isDecimal: { msg: 'Balance must be a decimal value' }
            }
        }
    }, {
        timestamps: true, // Automatically adds createdAt and updatedAt timestamps
        tableName: 'ewallet' // Explicitly specifies table name to avoid any automatic naming conventions
    });

    return Ewallet;
};
