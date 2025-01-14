const express = require('express');
const router = express.Router();
const Article = require('../classes/Article');
const User = require('../classes/User');
const Review = require('../classes/Review');
const Conference = require('../classes/Conference');

// Create a new article
router.post('/articles', async (req, res) => {
    try {
        const { title, content, authorId, conferenceId } = req.body;

        // Validate the required fields
        if(!title || !content || !authorId || !conferenceId) {
            return res.status(400).json({ error: 'Title, content, authorId and conferenceId are required' });
        }

         // Verify author exists
        const author = await User.findOne({
            where: { id: authorId, role: 'author' }
        });

        if(!author) {
            return res.status(403).json({ error: 'Invalid author' });
        }

        const newArticle = await Article.create({
            title,
            content,
            authorId,
            conferenceId,
            status: 'submitted'
        });

          // Automatically allocate 2 reviewers
          const reviewers = await User.findAll({ 
            where: { role: 'reviewer' },
            limit: 2 
        });

        if(reviewers.length < 2) {
            await newArticle.destroy();
            return res.status(400).json({ error: 'Not enough reviewers available' });
        }

        // Create review assignments
        for (const reviewer of reviewers) {
            await Review.create({
                articleId: newArticle.id,
                reviewerId: reviewer.id,
                status: 'needs revision'
            });
        }

        // Update article status to under review
        newArticle.status = 'under review';
        await newArticle.save();

        res.status(201).json(newArticle);
    } catch (error) {
        console.error('Error while creating an article:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update an article
router.put('/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, authorId } = req.body;

        const article = await Article.findByPk(id);

        if(!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        // Verify author
        const author = await User.findOne({
            where: { id: authorId, role: 'author' }
        });

        if(!author) {
            return res.status(403).json({ error: 'Invalid author' });
        }

        // Update fields
        article.title = title || article.title;
        article.content = content || article.content;
        article.status = 'under review';

        await article.save();
        res.status(200).json(article);
    } catch (error) {
        console.error('Error updating the article:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all articles
router.get('/articles', async (req, res) => {
    try {
        const articles = await Article.findAll({
            include: [
                { model: Review, include: [User] },
                { model: Conference }
            ]
        });
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/*
//Reviewer Accepts or Provides Feedback
router.post('/articles/:id/review', async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewerId, feedback, status } = req.body;

        // Validate input
        if (!reviewerId || !status || (status === 'rejected' && !feedback)) {
            return res.status(400).json({ error: 'Reviewer ID, status, and feedback (if rejected) are required.' });
        }

        // Find the review record
        const review = await Review.findOne({ where: { articleId: id, reviewerId } });
        if (!review) {
            return res.status(404).json({ error: 'Review not found for this article and reviewer.' });
        }

        // Update the review
        review.status = status;
        review.feedback = feedback || null;
        await review.save();

        res.status(200).json(review);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Author Uploads a New Version
router.put('/articles/:id/upload', async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required.' });
        }

        // Find the article
        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found.' });
        }

        // Update the article content
        article.content = content;
        article.status = 'submitted';
        await article.save();

        res.status(200).json(article);
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

Get articles by author
router.get('/articles/author/:authorId', async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: { authorId: req.params.authorId },
            include: [{ model: Review, include: [User] }]
        });
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching author articles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Fetch Reviews for an Article
router.get('/articles/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;

        // Find reviews for the article
        const reviews = await Review.findAll({ where: { articleId: id } });

        if (!reviews.length) {
            return res.status(404).json({ error: 'No reviews found for this article.' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Organizer Monitors Article States
router.get('/articles/organizer/:organizerId', async (req, res) => {
    try {
        const { organizerId } = req.params;

        // Fetch articles related to the organizer's conferences
        const articles = await Article.findAll({
            include: [
                {
                    model: Conference,
                    where: { organizerId },
                },
            ],
        });

        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching organizer articles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete an article
router.delete('/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findByPk(id);

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        await article.destroy();
        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Error deleting the article:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 */

module.exports = router;
