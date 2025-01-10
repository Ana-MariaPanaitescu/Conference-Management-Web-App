//nmp init -y
// npm install express body-parser sequelize cors sqlite3

const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const cors = require ('cors')

const sequelize = new Sequelize('conference-db', 'user', 'password',{
    dialect:'sqlite',
    storage: 'db.sqlite' //Database file
})

//module.exports = sequelize;

const User = require('./User');
const Conference = require('../classes/Conference');
const Article = require('../classes/Article');
const Review = require('../classes/Review');

// Relationships between tables of the database

// An organizer creates conferences
Conference.belongsTo(User, { foreignKey: 'organizerId' });
User.hasMany(Conference, { foreignKey: 'organizerId' });

// An author submits articles
Article.belongsTo(User, { foreignKey: 'authorId' });
User.hasMany(Article, { foreignKey: 'authorId' });

// An article has multiple reviews
Article.hasMany(Review, { foreignKey: 'articleId' });
Review.belongsTo(Article, { foreignKey: 'articleId' });

// A reviewer can review many articles
User.hasMany(Review, { foreignKey: 'reviewerId' });
Review.belongsTo(User, { foreignKey: 'reviewerId' });