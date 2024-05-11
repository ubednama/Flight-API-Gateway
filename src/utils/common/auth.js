const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../../config');

function comparePasswords(password, hashedPassword) {
    try {
        return bcrypt.compareSync(password, hashedPassword);
    } catch (error) {
        console.log(error)
        throw error
    }
}

function generateToken(input) {
    try {
        return jwt.sign(input, ServerConfig.JWT_SECRET, {expiresIn: ServerConfig.JWT_EXPIRY})
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    comparePasswords,
    generateToken
}