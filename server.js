const express = require("express");
//const connectDB = require("./config/dbConnection");
const { connectDb, sequelize } = require("./config/dabatase");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

connectDb().then(() => {
    sequelize.sync(); // Sync all models
});

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});