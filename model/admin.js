/**
 * admin.js
 * @description :: sequelize model of database custom_admin
*/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
let admin = sequelize.define('admin', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    logo: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    admin_email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    password: { type: DataTypes.TEXT },
    address: { type: DataTypes.TEXT },
    gstIn: { type: DataTypes.STRING },
    panNumber: { type: DataTypes.STRING },
    countryId: { type: DataTypes.UUID },
    stateId: { type: DataTypes.UUID },
    isActive: { type: DataTypes.BOOLEAN },
    pass_verify_code: { type: DataTypes.TEXT },
    pass_expiry_time: { type: DataTypes.DATE },
    for_pass_status: { type: DataTypes.INTEGER },
    twoFactorStatus: { type: DataTypes.INTEGER, defaultValue: 0 },
    twoFactorSecretKey: { type: DataTypes.TEXT, defaultValue: '' },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
});
module.exports = admin;
