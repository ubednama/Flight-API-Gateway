const { StatusCodes } = require('http-status-codes')
const { UserRepository, RoleRepository } = require("../repositories");
const AppError = require("../utils/errors/app.error");
const { Auth, Enums } = require('../utils/common');

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data) {
    try {
        const user = await userRepository.create(data)
        const role = await roleRepository.getRoleByName(Enums.USER_ROLES_ENUMS.CUSTOMER)
        user.addRole(role);
        return user

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

async function isAuthenticated(token) {
    try {
        if(!token) {
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST)
        }
        const response = Auth.verifyToken(token);
        const user =  await userRepository.getUserByEmail(response.email)
        if(!user) {
            throw new AppError("User doesn't exists", StatusCodes.NOT_FOUND)
        }
        return user.id
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token Expired', StatusCodes.BAD_REQUEST);
        }
        console.log(error)
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function addRoleToUser(data) {
    try {
        const user = await userRepository.get(data.id)
        if(!user) {
            throw new AppError("User doesn't exists", StatusCodes.NOT_FOUND)
        }
        const role = await roleRepository.getRoleByName(data.role)
        if(!role) {
            throw new AppError("No user found for given role", StatusCodes.NOT_FOUND)
        }
        user.addRole(role);
        return user
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.log(error)
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(id) {
    try{
        const user = await userRepository.get(id);
        if(!user) {
            throw new AppError("User doesn't exists", StatusCodes.NOT_FOUND)
        }
        const adminRole = await roleRepository.getRoleByName(Enums.USER_ROLES_ENUMS.ADMIN)
        if(!adminRole) {
            throw new AppError("No user found for given role", StatusCodes.NOT_FOUND)
        }
        return user.hasRole(adminRole);
    } catch(error) {
        if (error instanceof AppError) throw error;
        console.log(error)
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    createUser,
    login,
    isAuthenticated,
    addRoleToUser,
    isAdmin
}