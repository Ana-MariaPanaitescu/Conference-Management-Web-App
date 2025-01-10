// const { DataTypes } = require('sequelize');
// const sequelize = require('../db');

const { sequelize, Sequelize } = require('../server');

const Article = sequelize.define('Article', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('submitted', 'under review', 'approved', 'rejected'),
    defaultValue: 'submitted'
  }
});

//module.exports = Article;
