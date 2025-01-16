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
const allowedOrigins = [
    'http://localhost:5173/', //adjust port for frontend
];

const corsOptions = {
    origin: (origin, callback) => {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error("Not allowed by CORS"), false); //directly ue error constructor
        }
    },
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
};

app.use(cors(corsOptions));

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

