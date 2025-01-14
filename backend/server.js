//nmp init -y
// npm install express body-parser sequelize cors sqlite3

const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const cors = require ('cors')

// Creating the database
const sequelize = new Sequelize('conference-db', 'user', 'password',{
    dialect:'sqlite',
    storage: 'db.sqlite' //Database file
})

//module.exports = sequelize;

// Import classes
const User = require('./classes/User');
const Conference = require('./classes/Conference');
const Article = require('./classes/Article');
const Review = require('./classes/Review');

// Relationships between tables of the database

// An organizer creates conferences
User.hasMany(Conference, { foreignKey: 'organizerId' });
Conference.belongsTo(User, { foreignKey: 'organizerId' });

// An author submits articles
User.hasMany(Article, { foreignKey: 'authorId' });
Article.belongsTo(User, { foreignKey: 'authorId' });

// An article has multiple reviews
Article.hasMany(Review, { foreignKey: 'articleId' });
Review.belongsTo(Article, { foreignKey: 'articleId' });

// A reviewer can review many articles
User.hasMany(Review, { foreignKey: 'reviewerId' });
Review.belongsTo(User, { foreignKey: 'reviewerId' });

// Middleware configuration

// Initialize Express app
const app = express()

// Middlewares
app.use(cors())
app.use(bodyParser.json())