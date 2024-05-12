const {StatusCodes} = require('http-status-codes')

const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

async function createUser(req, res) {
    try {
        const user = await UserService.createUser({
            email: req.body.email,
            password:req.body.password
        });
        SuccessResponse.message = "New User Created";
        SuccessResponse.data = user;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.message = "Failed to create new User";
        ErrorResponse.error = error;
        return res
            .status(error.statusCode)
            .json(ErrorResponse)
    }
}

async function login(req, res) {
    try {
        const user = await UserService.login({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse)
    } catch (error) {
        console.log(error)
        ErrorResponse.error = error;
        return res
            .status(error.statusCode)
            .json(ErrorResponse)
    }
}

async function addRoleToUser(req, res) {
    try {
        const response = await UserService.addRoleToUser({
            role: req.body.role,
            id: req.body.id
        });
        SuccessResponse.data = response;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse)
    } catch (error) {
        console.log(error)
        ErrorResponse.error = error;
        return res
            .status(error.statusCode)
            .json(ErrorResponse)
    }
}

module.exports = {
    createUser,
    login,
    addRoleToUser
}