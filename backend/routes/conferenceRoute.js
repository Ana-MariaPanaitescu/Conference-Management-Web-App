// conferenceRoute.js
const express = require('express');
const router = express.Router();
const Conference = require('../classes/Conference');
const User = require('../classes/User');
const auth = require('../middleware/auth'); // Import the auth middleware

// Create a new conference - Add auth middleware
router.post('/', auth, async(req, res) => {
    try {
        const { title, description, date, reviewerIds } = req.body;
        const organizerId = req.user.id; // Get organizer ID from authenticated user

        // Validate required fields
        if(!title || !description || !date) {
            return res.status(400).json({ error: 'Title, description and date are required' });
        }

        // Validate date format
        if(isNaN(Date.parse(date))) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Verify organizer role (additional security check)
        const organizer = await User.findOne({
            where: { id: organizerId, role: 'organizer' }
        });
        
        if(!organizer) {
            return res.status(403).json({ error: 'User must be an organizer to create conferences' });
        }

        const newConference = await Conference.create({
            title,
            description,
            date,
            organizerId
        });

        // Optional: Associate reviewers if reviewerIds is provided
        if(reviewerIds && Array.isArray(reviewerIds)) {
            const reviewers = await User.findAll({
                where: { id: reviewerIds, role: 'reviewer' }
            });
            await newConference.addReviewers(reviewers);
        }

        res.status(201).json(newConference);
    } catch (error) {
        console.error('Error while trying to create a conference:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;
