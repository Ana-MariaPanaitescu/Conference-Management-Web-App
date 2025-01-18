const express = require('express');
const router = express.Router();
const Review = require('../classes/Review');
const Article = require('../classes/Article');
const User = require('../classes/User');
//const reviewRouter = express.Router();

// Create a new review
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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

// // Update review with feedback
// reviewRouter.put('/:id', auth, checkRole(['reviewer']), async (req, res) => {
//     try {
//         const { feedback, status } = req.body;
//         const reviewId = req.params.id;
//         const reviewerId = req.user.id;

//         // Validate status
//         const validStatuses = ['accepted', 'rejected', 'needs revision'];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ error: 'Invalid status' });
//         }

//         // Find review
//         const review = await Review.findByPk(reviewId);
//         if (!review) {
//             return res.status(404).json({ error: 'Review not found' });
//         }

//         // Verify reviewer
//         if (review.reviewerId !== reviewerId) {
//             return res.status(403).json({ error: 'Unauthorized - not the reviewer' });
//         }

//         // Update review
//         await review.update({ feedback, status });

//         // Check all reviews status and update article status
//         const allReviews = await Review.findAll({ 
//             where: { articleId: review.articleId } 
//         });
        
//         const article = await Article.findByPk(review.articleId);
//         const allAccepted = allReviews.every(r => r.status === 'accepted');
//         const anyRejected = allReviews.some(r => r.status === 'rejected');
        
//         if (allAccepted) {
//             await article.update({ status: 'approved' });
//         } else if (anyRejected) {
//             await article.update({ status: 'rejected' });
//         } else {
//             await article.update({ status: 'under review' });
//         }

//         // Get updated review with related data
//         const updatedReview = await Review.findByPk(reviewId, {
//             include: [
//                 { model: Article },
//                 { model: User, as: 'reviewer' }
//             ]
//         });

//         res.status(200).json(updatedReview);
//     } catch (error) {
//         console.error('Error updating review:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// Get reviews by article
router.get('/article/:articleId', async (req, res) => {
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
router.get('/', async( req, res) => {
    try {
        const reviews = await Review.findAll();
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching the reviews:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// // Get reviews assigned to reviewer
// reviewRouter.get('/assigned', auth, checkRole(['reviewer']), async (req, res) => {
//     try {
//         const reviews = await Review.findAll({
//             where: { reviewerId: req.user.id },
//             include: [
//                 { 
//                     model: Article,
//                     include: [
//                         { model: Conference },
//                         { model: User, as: 'author' }
//                     ]
//                 }
//             ]
//         });
//         res.status(200).json(reviews);
//     } catch (error) {
//         console.error('Error fetching assigned reviews:', error);
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
//module.exports = { articleRouter: router, reviewRouter };
