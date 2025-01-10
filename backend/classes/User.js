// const { DataTypes } = require('sequelize');
// const sequelize = require('../config');

const { sequelize, Sequelize } = require('../server');

const User = sequelize.define('User', {
    role: {
      type: Sequelize.ENUM('organizer', 'reviewer', 'author'),
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  });
  
  //module.exports = User;
