const express = require('express');
const router = express.Router();
const Review = require('../classes/Review');
//const Article = require('../classes/Article');

// Create a new review
router.post('/reviews', async (req, res) => {
    try{
        const { articleId, reviewerId, feedback, status } = req.body;

        // Validate required fields
        if (!articleId || !reviewerId) {
            return res.status(400).json({ error: 'Article ID and reviewer ID are required' });
        }

        // Validate status if provided
        // const validStatuses = ['pending', 'accepted', 'rejected', 'needs_revision'];
        // if (status && !validStatuses.includes(status)) {
        //     return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
        // }

        // Validate feedback
        if(feedback & typeof feedback !== 'string'){
            return res.status(400).json({ error: 'Feedback must be a string'});
        }

        // Validate status if provided
        const validStatuses = ['accepted', 'rejected', 'needs revision'];
        if(status & !validStatuses.includes(status)){
            return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        const newReview = await Review.create({ feedback, status });

        // const newReview = await Review.create({ 
        //     articleId, 
        //     reviewerId, 
        //     feedback, 
        //     status: status || 'pending' 
        // });

        res.status(201).json(newReview);
    } catch(error){
        console.error('Error while trying to create a review:', error);
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

// Update review feedback and status
router.post('/reviews/:reviewId/feedback', async (req, res) => {
    try {
        const { feedback, status } = req.body;

        // Validate input fields
        if (feedback && typeof feedback !== 'string') {
            return res.status(400).json({ error: 'Feedback must be a string' });
        }

        const validStatuses = ['accepted', 'rejected', 'needs revision'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        // Find the review by ID
        const review = await Review.findByPk(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Update the review
        await review.update({ feedback, status });
        res.json(review);
    } catch (error) {
        console.error('Error updating the review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// // Update review status and feedback
// router.put('/reviews/:id', async (req, res) => {
//     try {
//         const { feedback, status } = req.body;
//         const { id } = req.params;

//         const review = await Review.findByPk(id);
//         if (!review) {
//             return res.status(404).json({ error: 'Review not found' });
//         }

//         const validStatuses = ['accepted', 'rejected', 'needs_revision'];
//         if (status && !validStatuses.includes(status)) {
//             return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
//         }

//         // If rejecting or requesting revision, feedback is required
//         if ((status === 'rejected' || status === 'needs_revision') && !feedback) {
//             return res.status(400).json({ error: 'Feedback is required when rejecting or requesting revision' });
//         }

//         await review.update({ 
//             feedback, 
//             status,
//             reviewDate: new Date()
//         });

//         // Update article status if all reviews are complete
//         const article = await Article.findByPk(review.articleId);
//         const allReviews = await Review.findAll({ where: { articleId: review.articleId } });
        
//         const allReviewsComplete = allReviews.every(r => r.status !== 'pending');
//         if (allReviewsComplete) {
//             const allAccepted = allReviews.every(r => r.status === 'accepted');
//             article.status = allAccepted ? 'accepted' : 'needs_revision';
//             await article.save();
//         }

//         res.json(review);
//     } catch (error) {
//         console.error('Error updating the review:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

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