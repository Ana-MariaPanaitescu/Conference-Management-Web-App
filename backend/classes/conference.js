const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Reference to sequelize instance from server.js (../ -  is the parent of the current directory - backend)

const Conference = sequelize.define('Conference', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = Conference;
