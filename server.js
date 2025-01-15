const express = require("express");
//const connectDB = require("./config/dbConnection");
const { connectDb, sequelize } = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require("cors"); //added cors package

connectDb().then(() => {
    sequelize.sync(); // Sync all models
});

const app = express();
const port = process.env.PORT || 5000;

//CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
    ? 'https://ewallet-frontend-1.herokuapp.com' 
    : 'http://localhost:5000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], //allowed method
    allowedHeaders: ['Content-Type', 'Authorization'], //allowed headers
    credentials: true //enable set cookie
}));

// Add this before your routes
app.use((req, res, next) => {
    next();
});

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running successfully");
    console.log("GET / endpoint hit");
  });

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
//ewallet
app.use("/api/ewallet", require("./routes/ewalletRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
