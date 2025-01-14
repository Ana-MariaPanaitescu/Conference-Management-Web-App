const { DataTypes } = require('sequelize');
const sequelize = require('../server');

const Review = sequelize.define('Review', {
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('accepted', 'rejected', 'needs revision'),
    defaultValue: 'needs revision'
  }
});

module.exports = Review;
