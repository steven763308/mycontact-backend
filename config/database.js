// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Setup connection to the database using environment variables
const database = process.env.DB_DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;  // or your database host
const port = process.env.DB_PORT;         // or your database port

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  logging: false,  // Enable logging
});

async function connectDb() {
  try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");

      // Add this to create tables
      await sequelize.sync({ alter: true });
      console.log("All models were synchronized successfully.");

  } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
  }
}

module.exports = {connectDb,sequelize};