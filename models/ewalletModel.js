const { Sequelize, DataTypes, Model } = require('sequelize');

// Establishing a connection to the database
const sequelize = new Sequelize('mysql://app_user:password123@localhost:3306/intern_mycontacts', {
    logging: false, // Disables logging; set to console.log to see SQL queries
    define: {
        freezeTableName: true // Disables the automatic pluralization of table names
    }
});



// Defining the EwalletCoin model
class EwalletCoin extends Model {}
EwalletCoin.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: 'unique_name',
            msg: 'The coin name must be unique.'
        },
        comment: 'Name of the coin.'
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: 'unique_symbol',
            msg: 'The coin symbol must be unique.'
        },
        comment: 'Symbol for the coin.'
    }
}, {
    sequelize,
    modelName: 'EwalletCoin',
    tableName: 'ewallet_coins'
});

// Defining the EwalletProfile model
class Ewallet extends Model {}
Ewallet.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            field: 'userId',
            model: 'users',
            key: 'id'
        },
        comment: 'User associated with this e-wallet profile.'
    },
    coinId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: '1',
        references: {
            model: 'ewallet_coins',
            key: 'id'
        },
        comment: 'Coin associated with this balance.'
    },
    balance: {
        type: DataTypes.DECIMAL(25, 10),
        defaultValue: 0,
        comment: 'Current balance of the e-wallet for this coin.'
    }
}, {
    sequelize,
    modelName: 'Ewallet',
    tableName: 'ewallet'
});

// Defining the EwalletTransaction model
class EwalletTransaction extends Model {}
EwalletTransaction.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        comment: 'User associated with this transaction.'
    },
    coinId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ewallet_coins',
            key: 'id'
        },
        comment: 'Coin associated with this transaction.'
    },
    type: {
        type: DataTypes.ENUM,
        values: ['deposit', 'reward', 'withdrawal', 'transfer', 'conversion', 'deduct', 'winnings'],
        allowNull: false,
        comment: 'Type of the transaction.'
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'approved', 'rejected', 'completed'],
        defaultValue: 'pending',
        comment: 'Current status of the transaction.'
    },
    amount: {
        type: DataTypes.DECIMAL(25, 10),
        allowNull: false,
        comment: 'Amount of the transaction.'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Description or note for the transaction.'
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date and time of the transaction.'
    }
}, {
    sequelize,
    modelName: 'EwalletTransaction',
    tableName: 'ewallet_transactions'
});

// Function to synchronize the database
async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true }); // Use `alter: true` to safely update tables if needed
        console.log("Database synced successfully.");
    } catch (error) {
        console.error("Failed to sync the database:", error);
    }
}

// Running the sync function
syncDatabase();

module.exports = { EwalletCoin, Ewallet, EwalletTransaction };



/*
const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {

  class EwalletCoin extends Model { }

  EwalletCoin.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'unique_name',
        msg: 'The coin name must be unique.'
      },
      comment: 'Name of the coin.'
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'unique_symbol',
        msg: 'The coin symbol must be unique.'
      },
      comment: 'Symbol for the coin.'
    },
  }, {
    sequelize,
    modelName: 'ewalletCoin',
    tableName: 'ewalletcoins',
  });

  class EwalletProfile extends Model { }

  EwalletProfile.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'User associated with this e-wallet profile.'
    },
    coinId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ewalletcoins',
        key: 'id'
      },
      comment: 'Coin associated with this balance.'
    },
    balance: {
      type: DataTypes.DECIMAL(25, 10),
      defaultValue: 0,
      comment: 'Current balance of the e-wallet for this coin.'
    },
  }, {
    sequelize, 
    modelName: 'ewalletProfile',
    tableName: 'ewalletprofiles',
  });

  class EwalletTransaction extends Model { }

  EwalletTransaction.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'User associated with this transaction.'
    },
    coinId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ewalletcoins',
        key: 'id'
      },
      comment: 'Coin associated with this transaction.'
    },
    type: {
      type: DataTypes.ENUM,
      values: ['deposit', 'reward', 'withdrawal', 'transfer', 'conversion', 'deduct', 'winnings'],
      allowNull: false,
      comment: 'Type of the transaction.'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'approved', 'rejected', 'completed'],
      defaultValue: 'pending',
      comment: 'Current status of the transaction.'
    },
    amount: {
      type: DataTypes.DECIMAL(25, 10),
      allowNull: false,
      comment: 'Amount of the transaction.'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description or note for the transaction.'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Date and time of the transaction.'
    }
  }, {
    sequelize,
    modelName: 'ewalletTransaction',
    tableName: 'ewallettransactions',
  });
  return { EwalletCoin, EwalletProfile, EwalletTransaction };
}
*/

  /*
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
  */