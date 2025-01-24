// Import dependencies
const express = require("express");
const cors = require("cors");
const { connectDb, sequelize } = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

// Initialize app and environment variables
const app = express();
const port = process.env.PORT || 5000;

// Connect to the database and sync models
connectDb()
    .then(() => sequelize.sync({ force: false }))
    .then(() => console.log("Database connected and models synced"))
    .catch((err) => {
        console.error("Database connection error:", err);
        process.exit(1);
    });

// CORS Configuration
const allowedOrigins = [
    "http://localhost:3000", // Adjust as per frontend setup
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"), false);
        }
    },
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("API is running successfully");
    console.log("GET / endpoint hit");
});
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/ewallet", require("./routes/ewalletRoutes"));

// Error Handler
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
