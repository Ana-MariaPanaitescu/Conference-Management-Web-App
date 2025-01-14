const express = require('express');
const router = express.Router();
const User = require('../classes/User');

// Create a new user
router.post('/users', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate role
        const validRoles = ['organizer', 'reviewer', 'author'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: `Role must be one of: ${validRoles.join(', ')}` });
        }

        const newUser = await User.create({
            name,
            email,
            password, // Note: In a real app, password should be hashed
            role
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get users by role
router.get('/users/role/:role', async (req, res) => {
    try {
        const validRoles = ['organizer', 'reviewer', 'author'];
        if (!validRoles.includes(req.params.role)) {
            return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
        }

        const users = await User.findAll({
            where: { role: req.params.role },
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users by role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;