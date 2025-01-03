/**
 * general_setting.js
 * @description :: sequelize model of database general_setting
*/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
let general_setting = sequelize.define('general_setting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  googleAnalytics: { type: DataTypes.BOOLEAN, defaultValue: false },
  googleAdsenseCode: { type: DataTypes.BOOLEAN, defaultValue: false },
  googleAnalyticsDesc: { type: DataTypes.STRING },
  googleAdsenseCodeDesc: { type: DataTypes.STRING },
  googleRecaptcha: { type: DataTypes.BOOLEAN, defaultValue: false },
  googleSiteKey: { type: DataTypes.STRING },
  googleSecretKey: { type: DataTypes.STRING },
  displayFbPixel: { type: DataTypes.BOOLEAN, defaultValue: false },
  displayFbMessenger: { type: DataTypes.BOOLEAN, defaultValue: false },
  fbPixelDesc: { type: DataTypes.STRING },
  fbMessengerPageId: { type: DataTypes.STRING },
  facebook: { type: DataTypes.TEXT },
  instagram: { type: DataTypes.TEXT },
  linkedin: { type: DataTypes.TEXT },
  youtube: { type: DataTypes.TEXT },
  twitter: { type: DataTypes.TEXT },
  pageTitle: { type: DataTypes.TEXT },
  webUrl: { type: DataTypes.TEXT },
  metaDescription: { type: DataTypes.TEXT },
  metaKeywords: { type: DataTypes.TEXT },
  metaRemaining: { type: DataTypes.TEXT },
  openGraph: { type: DataTypes.TEXT },
  openGraphImage: { type: DataTypes.TEXT },
  whatsappDetails: { type: DataTypes.TEXT },
  quickConnect: { type: DataTypes.TEXT },
  latitude: { type: DataTypes.TEXT },
  longitude: { type: DataTypes.TEXT },


  mobileNumber: { type: DataTypes.TEXT },
  telephoneNumber: { type: DataTypes.TEXT },
  businessEmail: { type: DataTypes.TEXT },
  businessEmail2: { type: DataTypes.TEXT },
  optionalMobileNumber: { type: DataTypes.TEXT },
  adminAddress: { type: DataTypes.TEXT },
  adminAddress2: { type: DataTypes.TEXT },
  companyCIN: { type: DataTypes.STRING },

  logo: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE },
  updatedAt: { type: DataTypes.DATE },
}
);
sequelizeTransforms(general_setting);
sequelizePaginate.paginate(general_setting);
module.exports = general_setting;
