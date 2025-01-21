const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * @desc Register a new user
 * @route POST /api/users/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    console.log("Registering user:", { username, email }); // Debugging log

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const userExists = await User.findOne({ where: { email } });
    console.log("User exists check:", userExists ? "User exists" : "User does not exist"); // Debugging log

    if (userExists) {
        res.status(400);
        throw new Error("User already registered!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword); // Debugging log

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (user) {
        console.log("User successfully created:", user); // Debugging log
        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

/**
 * @desc Authenticate a user and return a token
 * @route POST /api/users/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log("Attempting login with:", { email, password }); // Debugging log

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const user = await User.findOne({ where: { email } });
    console.log("User lookup result:", user); // Debugging log

    if (user && (await bcrypt.compare(password, user.password))) {
        console.log("Password validation successful for user:", user.email); // Debugging log

        const accessToken = jwt.sign(
            {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
        );

        console.log("Generated JWT token:", accessToken); // Debugging log
        res.status(200).json({ accessToken });
    } else {
        console.error("Invalid email or password for:", email); // Debugging log
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

/**
 * @desc Get current authenticated user info
 * @route GET /api/users/current
 * @access Private
 */
const currentUser = asyncHandler(async (req, res) => {
    console.log("Fetching current user info:", req.user); // Debugging log
    res.json(req.user);
});

/**
 * @desc Get user profile information
 * @route GET /api/users/profile
 * @access Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
    console.log("Fetching profile info for user:", req.user); // Debugging log
    res.json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
    });
});

module.exports = {
    registerUser,
    loginUser,
    currentUser,
    getUserProfile,
};
