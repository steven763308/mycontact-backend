const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

//Middleware to validate JWT tokens for protected routes
const validateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Check if Authorization header exists and starts with "Bearer "
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            // Attach user information from the token to the request object
            req.user = decoded.user;
            next();
        } catch (err) {
            console.error("JWT Verification Error:", err.message);
            res.status(401).json({ message: "User is not authorized, token verification failed" });
        }
    } else {
        res.status(401).json({ message: "User is not authorized or token is missing" });
    }
});

module.exports = validateToken;
