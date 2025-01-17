const jwt = require('jsonwebtoken');
const config = require('../config');

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authentication token required' });
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded; // Add user info to request object
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
};

// Role-based access control middleware
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions' });
        }
        next();
    };
};

module.exports = { auth, checkRole };
