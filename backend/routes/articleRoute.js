const express = require('express');
const router = express.Router();
const Article = require('../classes/Article');
const User = require('../classes/User');
const Review = require('../classes/Review');
const Conference = require('../classes/Conference');
const { auth, checkRole } = require('../middleware/auth');

// Create a new article
router.post('/', auth, checkRole(['author']), async (req, res) => {
    try {
        const { title, content, conferenceId } = req.body;
        const authorId = req.user.id;

        // Validate required fields
        if (!title || !content || !conferenceId) {
            return res.status(400).json({ error: 'Title, content, and conferenceId are required' });
        }

        // Verify conference exists
        const conference = await Conference.findByPk(conferenceId, {
            include: [{ model: User, as: 'reviewers' }]
        });
        
        if (!conference) {
            return res.status(404).json({ error: 'Conference not found' });
        }

        // Check if conference has enough reviewers
        if (conference.reviewers.length < 2) {
            return res.status(400).json({ error: 'Conference needs at least 2 reviewers' });
        }

        // Create article
        const newArticle = await Article.create({
            title,
            content,
            authorId,
            conferenceId,
            status: 'submitted'
        });

        // Randomly assign 2 unique reviewers
        const shuffledReviewers = conference.reviewers.sort(() => 0.5 - Math.random());
        const selectedReviewers = shuffledReviewers.slice(0, 2);

        // Create reviews
        await Promise.all(selectedReviewers.map(reviewer => 
            Review.create({
                articleId: newArticle.id,
                reviewerId: reviewer.id,
                status: 'needs revision'
            })
        ));

        // Update article status
        await newArticle.update({ status: 'under review' });

        // Fetch complete article data with reviews
        const articleWithReviews = await Article.findByPk(newArticle.id, {
            include: [
                { model: Review, include: [{ model: User, as: 'reviewer' }] },
                { model: User, as: 'author' },
                { model: Conference }
            ]
        });

        res.status(201).json(articleWithReviews);
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update article (for revisions)
router.put('/:id', auth, checkRole(['author']), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const authorId = req.user.id;

        const article = await Article.findOne({
            where: { id, authorId }
        });

        if (!article) {
            return res.status(404).json({ error: 'Article not found or unauthorized' });
        }

        await article.update({
            title: title || article.title,
            content: content || article.content,
            status: 'under review'
        });

        const updatedArticle = await Article.findByPk(article.id, {
            include: [
                { 
                    model: Review,
                    include: [{ model: User, as: 'reviewer' }]
                },
                { model: User, as: 'author' },
                { model: Conference }
            ]
        });

        res.status(200).json(updatedArticle);
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.findAll({
            include: [
                {
                    model: Review,
                    include: [{
                        model: User,
                        as: 'reviewer'  // This matches the alias in your relationships
                    }]
                },
                {
                    model: User,
                    as: 'author'  // This matches the alias in your relationships
                },
                {
                    model: Conference
                }
            ]
        });
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get articles by conference
router.get('/conference/:conferenceId', auth, async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: { conferenceId: req.params.conferenceId },
            include: [
                { 
                    model: Review,
                    include: [{ model: User, as: 'reviewer' }]
                },
                { model: User, as: 'author' },
                { model: Conference }
            ]
        });
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching conference articles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get author's articles
router.get('/author', auth, checkRole(['author']), async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: { authorId: req.user.id },
            include: [
                { 
                    model: Review,
                    include: [{ model: User, as: 'reviewer' }]
                },
                { model: Conference }
            ]
        });
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching author articles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
