const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Correct import using destructuring

//console.log('Sequelize instance:', sequelize); // Debugging log to ensure the instance is valid

const Ewallet = sequelize.define('Ewallet', {
    wallet_id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    balance: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
        defaultValue: 0 },
}, {
    timestamps: true, // Adds createdAt and updatedAt columns
    tableName: 'ewallet',
});

module.exports = Ewallet;
