const express = require('express');
const router = express.Router();
const User = require('../classes/User');
const bcrypt = require('bcrypt');

// Create a new user
router.post('/', async (req, res) => {
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Remove password from response
        const userResponse = newUser.toJSON();
        delete userResponse.password;

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// User login
router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });
        if(!user) {
            return res.status(401).json({ error: 'Invalid email' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all users
router.get('/', async (req, res) => {
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
router.get('/role/:role', async (req, res) => {
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