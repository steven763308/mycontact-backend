const express = require("express");
const {
    registerUser, 
    loginUser, 
    currentUser, 
    getUserProfile
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

// User Routes -> User Controller
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);
router.get("/profile", getUserProfile);

module.exports = router;
