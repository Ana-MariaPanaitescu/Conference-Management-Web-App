const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const { sequelize, Sequelize } = require('../server');

const Organizer = sequelize.define('Organizer', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
});

//module.exports = Organizer;
