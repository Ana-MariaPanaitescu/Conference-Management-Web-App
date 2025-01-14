const express = require('express');
const router = express.Router();
const Review = require('../classes/Review');
const Article = require('../classes/Article');
const User = require('../classes/User');

// Create a new review
router.post('/reviews', async (req, res) => {
    try{
        const { articleId, reviewerId, feedback, status } = req.body;

        // Validate required fields
        if(!articleId || !reviewerId) {
            return res.status(400).json({ error: 'Article ID and reviewer ID are required' });
        }

         // Verify reviewer
         const reviewer = await User.findOne({
            where: { id: reviewerId, role: 'reviewer' }
        });

        if(!reviewer) {
            return res.status(403).json({ error: 'Invalid reviewer' });
        }

        // Validate feedback
        if(feedback & typeof feedback !== 'string'){
            return res.status(400).json({ error: 'Feedback must be a string'});
        }

        // Validate status if provided
        const validStatuses = ['accepted', 'rejected', 'needs revision'];
        if(status & !validStatuses.includes(status)){
            return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        const newReview = await Review.create({ 
            articleId, 
            reviewerId, 
            feedback, 
            status: status || 'needs revision' 
        });

        res.status(201).json(newReview);
    } catch(error){
        console.error('Error while trying to create a review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update review
router.put('/reviews/:id', async (req, res) => {
    try {
        const { feedback, status, reviewerId } = req.body;
        const { id } = req.params;

        // Verify reviewer
        const reviewer = await User.findOne({
            where: { id: reviewerId, role: 'reviewer' }
        });

        if(!reviewer) {
            return res.status(403).json({ error: 'Invalid reviewer' });
        }

        const review = await Review.findByPk(id);
        if(!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const validStatuses = ['accepted', 'rejected', 'needs revision'];
        if(status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        await review.update({ feedback, status });

        // Update article status based on reviews
        const article = await Article.findByPk(review.articleId);
        const allReviews = await Review.findAll({ where: { articleId: review.articleId } });
        
        const allAccepted = allReviews.every(r => r.status === 'accepted');
        const anyRejected = allReviews.some(r => r.status === 'rejected');
        
        if(allAccepted) {
            article.status = 'approved';
        } else if (anyRejected) {
            article.status = 'rejected';
        } else {
            article.status = 'under review';
        }
        
        await article.save();

        res.json(review);
    } catch (error) {
        console.error('Error updating the review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get reviews by article
router.get('/reviews/article/:articleId', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { articleId: req.params.articleId },
            include: [{
                model: User,
                as: 'reviewer',
                attributes: ['id', 'name', 'email', 'role']
            }]
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching article reviews:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all reviews
router.get('/reviews', async( req, res) => {
    try {
        const reviews = await Review.findAll();
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching the reviews:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// // Get reviews by reviewer
// router.get('/reviews/reviewer/:reviewerId', async (req, res) => {
//     try {
//         const reviews = await Review.findAll({
//             where: { reviewerId: req.params.reviewerId },
//             include: [Article]
//         });
//         res.status(200).json(reviews);
//     } catch (error) {
//         console.error('Error fetching reviewer reviews:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

module.exports = router;