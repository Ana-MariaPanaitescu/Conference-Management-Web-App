const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Article = sequelize.define('Article', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('submitted', 'under review', 'approved', 'rejected'),
    defaultValue: 'submitted'
  },
  conferenceId: {  
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Conferences',
      key: 'id'
    }
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Article;
