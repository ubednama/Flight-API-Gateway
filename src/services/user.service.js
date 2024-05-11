const { StatusCodes } = require('http-status-codes')
const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app.error");
const { Auth } = require('../utils/common');

const userRepository = new UserRepository();

async function createUser(data) {
    try {
        const response = await userRepository.create(data)
        return response
    } catch (error) {
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelzeUniqueConstraintError') {
            let desc = [];
            error.errors.forEach((err) => {
                desc.push(err.message);
            })
            throw new AppError(desc, StatusCodes.BAD_REQUEST)
        }
        throw new AppError("Failed to add new User", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function login(data) {
    try {

        const user = await userRepository.getUserByEmail(data.email)
        if(!user) {
            throw new AppError("User doesn't exists", StatusCodes.NOT_FOUND)
        }

        const verifyPassword = Auth.comparePasswords(data.password, user.password)
        if(!verifyPassword) {
            throw new AppError('Invalid Password', StatusCodes.BAD_REQUEST)
        }

        const jwt = Auth.generateToken({id: user.id, email: user.email})
        return jwt;
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error)
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createUser,
    login
}