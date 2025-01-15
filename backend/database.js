const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
    config.dbConfig.database,
    config.dbConfig.username,
    config.dbConfig.password,
    {
        dialect: config.dbConfig.dialect,
        storage: config.dbConfig.storage,
        logging: config.dbConfig.logging
    }
);

module.exports = sequelize;