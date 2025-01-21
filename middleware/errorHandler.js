const { constants } = require("../constants");

/**
 * @desc Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    // Common error response format
    const errorResponse = {
        title: "",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "development" ? err.stack : undefined, // Include stack trace only in development
    };

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            errorResponse.title = "Validation Failed";
            break;

        case constants.NOT_FOUND:
            errorResponse.title = "Not Found";
            break;

        case constants.UNAUTHORIZED:
            errorResponse.title = "Unauthorized";
            break;

        case constants.FORBIDDEN:
            errorResponse.title = "Forbidden";
            break;

        case constants.SERVER_ERROR:
        default:
            errorResponse.title = "Server Error";
            break;
    }

    // Send the error response
    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
