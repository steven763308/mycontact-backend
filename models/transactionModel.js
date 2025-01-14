const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Correct import
const Ewallet = require('./ewalletModel'); // Ensure this path is correct

console.log('Sequelize instance in transactionModel:', sequelize);

const Transaction = sequelize.define('Transaction', {
    transaction_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    wallet_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Ewallet, key: 'wallet_id' } 
    },
    transaction_type: { type: DataTypes.ENUM('add', 'subtract', 'transfer'), allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    details: { type: DataTypes.STRING },
}, {
    timestamps: true, // Adds createdAt and updatedAt columns
    tableName: 'transactions',
});

module.exports = Transaction;
