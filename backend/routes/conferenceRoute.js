const express = require('express');
const router = express.Router();
const Conference = require('../classes/Conference');
const User = require('../classes/User');
const { auth, checkRole } = require('../middleware/auth');

// Create a new conference - add auth middleware and role check
router.post('/', auth, checkRole(['organizer']), async(req, res) => {
    try {
        const { title, description, date, reviewerIds } = req.body; 
        const organizerId = req.user.id; // Now safe to use because of auth middleware

        // Validate required fields
        if(!title || !description || !date || !reviewerIds || !Array.isArray(reviewerIds)) {
            return res.status(400).json({ error: 'Title, description, date and reviewer IDs (array) are required' });
        }

        // Validate date format
        if(isNaN(Date.parse(date))) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Verify reviewers exist and have correct role
        const reviewers = await User.findAll({
            where: { 
                id: reviewerIds,
                role: 'reviewer'
            }
        });

        if(reviewers.length !== reviewerIds.length) {
            return res.status(400).json({ error: 'One or more invalid reviewer IDs' });
        }

        // Added validation for minimum 2 reviewers requirement
        if (reviewerIds.length < 2) {
            return res.status(400).json({ error: 'At least 2 reviewers are required' });
        }

        // Create conference
        const newConference = await Conference.create({ 
            title, 
            description, 
            date, 
            organizerId 
        });

        // Associate reviewers with conference
        await newConference.setReviewers(reviewers);

        // Fetch the complete conference data with associations
        const conferenceWithData = await Conference.findByPk(newConference.id, {
            include: [
                { model: User, as: 'organizer', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'reviewers', attributes: ['id', 'name', 'email'] }
            ]
        });

        res.status(201).json(conferenceWithData);
    } catch (error) {
        console.error('Error while trying to create a conference:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Get conference by ID with all related data
router.get('/:id', async (req, res) => {
    try {
        const conference = await Conference.findByPk(req.params.id, {
            include: [
                { model: User, as: 'organizer' },
                { model: User, as: 'reviewers' }
                //{ model: Article, include: [Review] }
            ]
        });
        
        if(!conference) {
            return res.status(404).json({ error: 'Conference not found' });
        }
        
        res.status(200).json(conference);
    } catch(error) {
        console.error('Error fetching the conference:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;