const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Ewallet = sequelize.define('Ewallet', {
      wallet_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        validate: {
          notNull: { msg: 'User ID is required' },
        },
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
    }, {
      tableName: 'ewallet',
      timestamps: true,
    });
  
    const EwalletTransaction = sequelize.define('EwalletTransaction', {
      transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ewallet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ewallet',
          key: 'wallet_id',
        },
        validate: {
          notNull: { msg: 'Ewallet ID is required' },
        },
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      transaction_type: {
        type: DataTypes.ENUM('credit', 'debit'),
        allowNull: false,
      },
    }, {
      tableName: 'ewallet_transactions',
      timestamps: true,
    });
  
    // Associations
    Ewallet.associate = (models) => {
      Ewallet.hasMany(models.EwalletTransaction, {
        foreignKey: 'ewallet_id',
        as: 'transactions',
        onDelete: 'CASCADE',
      });
    };
  
    EwalletTransaction.associate = (models) => {
      EwalletTransaction.belongsTo(models.Ewallet, {
        foreignKey: 'ewallet_id',
        as: 'ewallet',
      });
    };
  
    return { Ewallet, EwalletTransaction };
  };