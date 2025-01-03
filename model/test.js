/**
 * test.js
 * @description :: sequelize model of database custom_test
*/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
let test = sequelize.define('test', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: { type: DataTypes.STRING },
    mobile_number: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    banner: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    office_address: { type: DataTypes.TEXT },
    details: { type: DataTypes.TEXT },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
});
module.exports = test;
