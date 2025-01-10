//nmp init -y
// npm install express body-parser sequelize cors sqlite3

const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const cors = require ('cors')

const sequelize = new Sequelize('conference-db', 'user', 'password',{
    dialect:'sqlite',
    storage: 'db.sqlite' //Database file
})

//module.exports = sequelize;