// const { DataTypes } = require('sequelize');
// const sequelize = require('../db');

const { sequelize, Sequelize } = require('../server');

const Review = sequelize.define('Review', {
  feedback: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  status: {
    type: Sequelize.ENUM('accepted', 'rejected', 'needs revision'),
    defaultValue: 'needs revision'
  }
});

//module.exports = Review;
