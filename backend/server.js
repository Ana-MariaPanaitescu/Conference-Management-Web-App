//nmp init -y
// npm install express body-parser sequelize cors sqlite3

const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cors = require ('cors');

// Creating the database
const sequelize = new Sequelize('conference-db', 'user', 'password',{
    dialect:'sqlite',
    storage: 'db.sqlite' //Database file
});

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


// Import routes
const userRoutes = require('./routes/userRoute');
const conferenceRoutes = require('./routes/conferenceRoute');
const articleRoutes = require('./routes/articleRoute');
const reviewRoutes = require('./routes/reviewRoute');

// Middleware configuration
// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Routes
// app.use('/api/users', userRoutes);
// app.use('/api/conferences', conferenceRoutes);
// app.use('/api/articles', articleRoutes);
// app.use('/api/reviews', reviewRoutes);

// Database sync and server start
// sequelize.sync({ force: false }).then(() => {
//     app.listen(config.port, () => {
//         console.log(`Server is running on port ${config.port}`);
//     });
// }).catch(err => {
//     console.error('Unable to connect to the database:', err);
// });

// module.exports = sequelize;
