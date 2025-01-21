const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * @desc Middleware to authenticate user requests using JWT
 */
const authenticate = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authorization token missing or malformed" });
        }

        const token = authHeader.replace("Bearer ", "");

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with the token
        const user = await User.findOne({
            where: { id: decoded._id }, // Adjust this to match your database schema
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid token or user not found" });
        }

        // Attach token and user to the request object for downstream middleware or routes
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(401).json({ error: "Authentication failed" });
    }
};

module.exports = authenticate;
