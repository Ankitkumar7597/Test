/**
 * Dashboard Controller.js
 * @description :: exports action methods for Dashboard Functions.
*/


/// Model For Queries
const formidable = require('formidable');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

const dbService = require('../../utils/dbService')
const Admin = require('../../model/admin');
const GeneralSetting = require('../../model/generalSetting');



exports.dashboard = async (req, res) => {
    try {
        const data = { type: 2, fileName: 'dashboard/dashboard', }
        res.render('admin/index', { flag_name: "dashboardOrderListGridData", activeMenu: 'dashboard', title: "Dashboard", banner_title: 'Order List', data, })
    } catch (error) {
        console.error("Error fetching blog details:", error);
        return res.internalServerError({ message: err.message });
    }

}

exports.profile = async (req, res) => {
    const data = { type: 2, fileName: 'dashboard/profile' }
    var ProfileData = await Admin.findOne({})
    var GeneralSettingData = await GeneralSetting.findOne({})
    var BusinessSettingData = ''
    let logo = ''
    let countryData = []
    let stateData = []
    let profileStateData = []
    let cityData = []
    let countryId = ''
    let stateId = ''
    let cityId = ''
    let profileCountryId = ''
    let profileStateId = ''

    if (ProfileData) {
        profileCountryId = ProfileData.countryId
        profileStateId = ProfileData.stateId

        if (ProfileData.countryId) {
            profileStateData = await State.findAll({
                where: { isActive: 1, isDeleted: 0, countryId: ProfileData.countryId },
                attributes: ['id', 'stateName',],
                order: [['stateName', 'ASC']]
            });
        }
    }

    if (BusinessSettingData) {
        countryId = BusinessSettingData.countryId
        stateId = BusinessSettingData.stateId
        cityId = BusinessSettingData.cityId
        if (BusinessSettingData.countryId) {
            stateData = await State.findAll({
                where: { isActive: 1, isDeleted: 0, countryId: BusinessSettingData.countryId },
                attributes: ['id', 'stateName',],
                order: [['stateName', 'ASC']]
            });
        }
        if (BusinessSettingData.stateId) {
            cityData = await Locality.findAll({
                where: { isActive: 1, isDeleted: 0, stateId: BusinessSettingData.stateId },
                attributes: ['id', 'localityName', 'zipcode'],
                order: [['localityName', 'ASC']]
            });
        }

    }
    res.render('admin/index', { flag_name: '', title: "Dashboard", data, ProfileData, BusinessSettingData, GeneralSettingData, logo, countryData, stateData, cityData, countryId, stateId, cityId, profileCountryId, profileStateId, profileStateData })
}

exports.updateProfile = async (req, res) => {
    try {
        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.internalServerError({ message: err.message });
            }
            let updateData = {
                admin_email: fields.admin_email,
                /* address: fields.adminAddress, */
                logo: fields.imageName
            }
            await dbService.update(Admin, {}, updateData);
            return res.success({ message: 'Profile Successfully Updated...', });
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }

}
exports.updateGeneralSettings = (req, res) => {
    try {
        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.internalServerError({ message: err.message });
            }
            let updateData = {
                facebook: fields.facebook,
                instagram: fields.instagram,
                linkedin: fields.linkedin,
                youtube: fields.youtube,
                twitter: fields.twitter,
                pageTitle: fields.pageTitle,
                webUrl: fields.webUrl,
                metaDescription: fields.metaDescription,
                metaKeywords: fields.metaKeywords,
                metaRemaining: fields.metaRemaining,
                openGraph: fields.openGraph,
                openGraphImage: fields.profile_picture_1,
                whatsappDetails: fields.whatsappDetails,
                quickConnect: fields.quickConnect,
                latitude: fields.latitude,
                longitude: fields.longitude,

                mobileNumber: fields.mobileNumber,
                optionalMobileNumber: fields.optionalMobileNumber,
                businessEmail: fields.businessEmail,
                adminAddress: fields.adminAddress,
                adminAddress2: fields.adminAddress2,
                businessEmail2: fields.businessEmail2,
                telephoneNumber: fields.telephoneNumber,
                companyCIN: fields.companyCIN,
            }
            let checkData = await GeneralSetting.findOne({ attributes: ['id'] });
            if (checkData) {
                await dbService.update(GeneralSetting, {}, updateData);
            } else {
                await dbService.createOne(GeneralSetting, updateData);
            }
            return res.success({ message: 'General Data Successfully Updated...', });
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }

}

exports.checkOldPassword = async (req, res) => {
    var old_password = req.body.old_password
    var sessionData = req.session.adminData

    var userInfo = await Admin.findOne({ where: { 'username': 'admin' } })
    if (userInfo) {
        bcrypt.compare(old_password, userInfo.password,
            async function (err, isMatch) {
                if (isMatch) {
                    return res.send(true)
                }
                if (!isMatch) {
                    return res.send(false)
                }
            })
    }

}
exports.updateAdminPassword = async (req, res) => {
    try {
        const adminData = await Admin.findOne({})
        const adminId = adminData.id
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }

            var old_password = fields.old_password
            var password = fields.new_password
            var confirm_password = fields.confirm_password
            var token;

            if (password !== confirm_password) {
                return res.failure({ message: 'Password and confirm password do not match ' });
            }
            if (password === old_password) {
                return res.failure({ message: 'New password cannot be the same as the old password' });
            }

            if (localStorage.getItem('dXNlcg==') != null) {
                token = localStorage.getItem('dXNlcg==')
            }
            if (token) {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
            }

            bcrypt.genSalt(10, function (err, Salt) {
                bcrypt.hash(password, Salt, async function (err, hash) {
                    if (err) {
                        return console.log('Cannot encrypt');
                    }

                    query = { id: adminId };
                    dataToUpdate = {
                        'password': hash
                    }
                    console.log("dataToUpdate", dataToUpdate);
                    await dbService.update(Admin, query, dataToUpdate);
                    return res.success({ message: 'Password updated succesfully..' });
                    //return res.send({ status: "update", msg: "Password updated succesfully.." });
                })
            })
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }

}
exports.changeLogoImage = async (req, res) => {
    let logo = await Admin.findOne({ attributes: ['logo'] });
    return res.send({ status: "success", logo });
}