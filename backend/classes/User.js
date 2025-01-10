const { DataTypes } = require('sequelize');
const sequelize = require('../server');

const User = sequelize.define('User', {
    role: {
      type: DataTypes.ENUM('organizer', 'reviewer', 'author'),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });
  
  //module.exports = User;
