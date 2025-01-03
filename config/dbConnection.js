
/**
 * dbConnection.js
 * @description :: database connection using sequelize
 */

const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('./db');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: false,
    timezone: '+05:30'
});
module.exports = sequelize;
