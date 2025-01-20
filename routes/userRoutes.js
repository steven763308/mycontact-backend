const express = require("express");
const { registerUser, loginUser, currentUser, getUserProfile } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
//const { authenticate } = require("../middleware/authenticate");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.get('/profile', getUserProfile); //authenticate,

module.exports = router;