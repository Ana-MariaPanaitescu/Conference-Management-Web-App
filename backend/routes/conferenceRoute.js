const express = require('express');
const router = express.Router();
const Conference = require('../classes/Conference');

// Create a new conference
router.post('/conferences', async(req, res) => {
    try{
        const { title, description, date, organizerId } = req.body;

        // Validate required fields
        if (!title || !description || !date || !organizerId) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Validate date format
        if (isNaN(Date.parse(date))) {
            return res.status(400).json({ error: 'Invalid date format.' });
        }

        const newConference = await Conference.create({ title, description, date, organizerId });
        res.status(201).json(newConference);
    } catch (error){
        //res.status(400).json({ error: error.message });

        console.error('Error while trying to create a conference:', error)
        res.status(500).json({error:'Internal Server Error'});
    }
});

// Get all conferences
router.get('/conferences', async (req, res) => {
    try{
        const conferences = await Conference.findAll();
        res.status(200).json(conferences);
    }catch(error){
        console.error('Error fetching the conferences:', error);
        res.status(500).json({error:'Internal Server Error'});
    }
});

module.exports = router;