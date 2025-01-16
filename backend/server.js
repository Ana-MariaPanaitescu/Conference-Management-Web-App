//nmp init -y
// npm install express body-parser sequelize cors sqlite3

const express = require('express');
const bodyParser = require('body-parser');
const cors = require ('cors');
const config = require('./config');
const sequelize = require('./database');

// Import classes
const User = require('./classes/User');
const Conference = require('./classes/Conference');
const Article = require('./classes/Article');
const Review = require('./classes/Review');

// Import routes
const userRoutes = require('./routes/userRoute');
const conferenceRoutes = require('./routes/conferenceRoute');
const articleRoutes = require('./routes/articleRoute');
const reviewRoutes = require('./routes/reviewRoute');

// Relationships between tables of the database

// An organizer creates conferences
User.hasMany(Conference, { foreignKey: 'organizerId', as: 'organizer' });
Conference.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

User.hasMany(Article, { foreignKey: 'authorId', as: 'author' });
Article.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Article.hasMany(Review, { foreignKey: 'articleId' });
Review.belongsTo(Article, { foreignKey: 'articleId' });

User.hasMany(Review, { foreignKey: 'reviewerId', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });

// Middleware configuration
// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/conferences', conferenceRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Added a route to check the server
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Verify if the database was created
app.post('/sync', async (req, res, next) => {
    try {
        await sequelize.sync({ force: true }); // Use { force: false } if you don't want to drop existing tables
        res.status(201).json({ message: 'Database created successfully!' });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// Database sync and server start
// Start server
const startServer = async () => {
    try {
        await sequelize.sync({ force: false });
        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

startServer();