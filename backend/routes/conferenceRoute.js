const express = require('express');
const router = express.Router();
const Conference = require('../classes/Conference');
const User = require('../classes/User');

// Create a new conference
router.post('/', async(req, res) => {
    try {
        const { title, description, date, organizerId, reviewerIds } = req.body; // Added reviewerIds to destructuring

        // Validate required fields
        if(!title || !description || !date || !organizerId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate date format
        if(isNaN(Date.parse(date))) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Verify organizer exists and has correct role
        const organizer = await User.findOne({
            where: { id: organizerId, role: 'organizer' }
        });

        if(!organizer) {
            return res.status(400).json({ error: 'Invalid organizer' });
        }

        const newConference = await Conference.create({ 
            title, 
            description, 
            date, 
            organizerId 
        });

        // Optional: Associate reviewers if reviewerIds is provided
        if(req.body.reviewerIds && Array.isArray(req.body.reviewerIds)) {
            const reviewers = await User.findAll({
                where: { 
                    id: req.body.reviewerIds,
                    role: 'reviewer'
                }
            });
            await newConference.addReviewers(reviewers);
        }

        res.status(201).json(newConference);
    } catch (error) {
        console.error('Error while trying to create a conference:', error);
        res.status(500).json({error:'Internal Server Error'});
    }
});

// Get all conferences
router.get('/', async (req, res) => {
    try{
        //const conferences = await Conference.findAll();

        const conferences = await Conference.findAll({
            include: [
                { model: User, as: 'organizer' },
                { model: User, as: 'reviewers' }
            ]
        });

        res.status(200).json(conferences);
    }catch(error){
        console.error('Error fetching the conferences:', error);
        res.status(500).json({error:'Internal Server Error'});
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