const { StatusCodes } = require('http-status-codes')
const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app.error");

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

module.exports = {
    createUser
}