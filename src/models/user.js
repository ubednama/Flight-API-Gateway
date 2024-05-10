'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8,16],
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
          msg: "Password must be 8-16 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character @$!%*?&"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};