// const { DataTypes } = require('sequelize');
// const sequelize = require('../config');

const { sequelize, Sequelize } = require('../server');

const Reviewer = sequelize.define('Reviewer', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expertise: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//module.exports = Reviewer;
