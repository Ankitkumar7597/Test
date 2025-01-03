/**
 * index.js
 * @description :: exports all the models and its relationships among other models
*/

const dbConnection = require('../config/dbConnection');
const db = {};
db.sequelize = dbConnection;
db.Admin = require('./admin');
db.Test = require('./test');


module.exports = db;