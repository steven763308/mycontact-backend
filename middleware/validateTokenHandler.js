const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Debug: Log the received Authorization header
    console.log("Authorization Header:", authHeader);

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];

        // Debug: Log the extracted token
        console.log("Extracted Token:", token);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                // Debug: Log any error from JWT verification
                console.log("JWT Verification Error:", err.message);

                res.status(401);
                return res.json({ message: "User is not authorized, token failed verification." });
            }

            // Debug: Log the decoded user information
            console.log("Decoded JWT:", decoded);

            req.user = decoded.user;
            next();
        });
    } else {
        if (!authHeader) {
            // Debug: Log missing Authorization header
            console.log("Missing Authorization Header");
        } else if (!authHeader.startsWith("Bearer ")) {
            // Debug: Log incorrect Authorization format
            console.log("Authorization Header does not start with Bearer");
        }

        res.status(401);
        return res.json({ message: "User is not authorized or token is missing" });
    }
});

module.exports = validateToken;
