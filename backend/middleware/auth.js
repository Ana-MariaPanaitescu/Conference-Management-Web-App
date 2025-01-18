const jwt = require('jsonwebtoken');
const config = require('../config');

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ error: 'No authentication token, authorization denied' });
        }

        // Verify it's a Bearer token
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = decoded; // This sets user info including id and role
            next();
        } catch (err) {
            res.status(401).json({ error: 'Token is not valid' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Role-based access control middleware
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions' });
        }
        next();
    };
};

module.exports = { auth, checkRole };