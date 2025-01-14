const { Sequelize, DataTypes } = require('sequelize');

// Establishing a connection to the database
const sequelize = new Sequelize('mysql://user:password@localhost:3306/mydb', {
    logging: false, // Disables logging; set to console.log to see SQL queries
    define: {
        freezeTableName: true // Disables the automatic pluralization of table names
    }
});

// Defining the User model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true // Ensures the username is not empty
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Ensures the email is valid
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [8, 100] // Password length must be between 8 and 100 characters
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW // Sets the default value to the current time
    }
}, {
    tableName: 'users' // Explicitly specifies table name to avoid any automatic naming conventions
});

// Function to synchronize the database
async function syncDatabase() {
    try {
        await sequelize.sync(); // Sync all models
        console.log("Database synced successfully.");
    } catch (error) {
        console.error("Failed to sync the database:", error);
    }
}

// Running the sync function
syncDatabase();

module.exports = User;