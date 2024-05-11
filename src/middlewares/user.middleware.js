const { StatusCodes } = require('http-status-codes')
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app.error");

function validateAuthRequest(req, res, next) {
    if(!req.body.email || !req.body.password) {
        ErrorResponse.message = "Enter proper Credentials";

        if(!req.body.email && !req.body.password) {
            ErrorResponse.error = new AppError(["Email & password cannot be empty"])
        }else if(!req.body.email) {
            ErrorResponse.error = new AppError(["Provide proper Email"])
        } else {
            ErrorResponse.error = new AppError(["Password field cannot be empty"])
        }

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    next();
}

module.exports = {
    validateAuthRequest
}