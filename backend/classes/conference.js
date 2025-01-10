// const { DataTypes } = require('sequelize');
// const sequelize = require('../server'); // Reference to sequelize instance from server.js (../ -  is the parent of the current directory - backend)

const { sequelize, Sequelize } = require('../server');

const Conference = sequelize.define('Conference', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

//module.exports = Conference;
