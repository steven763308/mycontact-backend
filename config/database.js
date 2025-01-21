const { Sequelize } = require("sequelize");
require("dotenv").config();

// Database configuration from environment variables
const {
    DB_DATABASE: database,
    DB_USERNAME: username,
    DB_PASSWORD: password,
    DB_HOST: host,
    DB_PORT: port,
} = process.env;

// Sequelize instance
const sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: "mysql",
    logging: false, // Disable logging; set to `console.log` for debugging
});

//Establish a connection to the database and synchronize models.
const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

        // Synchronize models
        await sequelize.sync({ alter: true });
        console.log("All models synchronized successfully.");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error; // Rethrow error for handling at a higher level
    }
};

module.exports = { connectDb, sequelize };
