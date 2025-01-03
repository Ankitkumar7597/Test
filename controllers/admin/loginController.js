const bcrypt = require('bcryptjs');
const formidable = require('formidable');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');


const dbService = require('../../utils/dbService')
const commonFunctions = require('../../helpers/function')

/// Model For Queries
const Admin = require('../../model/admin');
const GeneralSetting = require('../../model/generalSetting');


exports.index = async (req, res) => {
    let data = { type: 1, fileName: 'login/login', title: 'New structure of code' }
    let title = 'New structure of code'
    res.render("admin/index", { data, title });
}

exports.adminLoginCheck = (req, res, next) => {
    const formData = formidable({ multiples: true });
    formData.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const username = fields.username;
        const password = fields.password;
        try {
            let userInfo = await dbService.findOne(Admin, { 'username': username, 'isActive': true });
            if (userInfo) {
                bcrypt.compare(password, userInfo.password,
                    async function (err, isMatch) {
                        // Comparing the original password to encrypted password   
                        if (isMatch) {
                            let admin_type = userInfo.admin_type
                            const token = jwt.sign(
                                { user_id: userInfo._id },
                                process.env.SECRET_KEY,
                                {
                                    expiresIn: "1d",
                                })

                            localStorage.setItem('dXNlcg==', token);
                            const sessionData = req.session
                            sessionData.adminData = userInfo
                            return res.success({ message: 'Login successfully.....Redirecting....', data: { url: '/dashboard' } });
                        }

                        if (!isMatch) {
                            return res.failure({ message: 'Invalid Login Details.!!' });
                        }
                    })
            } else {
                return res.failure({ message: 'Invalid Login Details.!!' });
            }
        } catch (err) {
            return res.internalServerError({ message: err.message });
        }
    });
};

exports.logout = (req, res) => {
    res.clearCookie("user_sid");
    req.session.destroy();
    localStorage.removeItem('dXNlcg==');
    return res.redirect(admin);
}

exports.forgotPws = async (req, res) => {
    var token = req.params
    let data = { type: 1, fileName: 'login/forgotPassword', title: 'Forget Password' }
    let title = 'Forget Password'
    res.render("admin/index", { data, title });
}

exports.checkEmail = async (req, res) => {
    try {
        var email = req.body.email
        const user = await Admin.findOne({ where: { 'admin_email': email, } });
        if (user) {
            return res.send(true)
        } else {
            return res.send(false)
        }
    } catch (err) {
        return res.redirect(admin);
    }
}
exports.forgotPassword = (req, res) => {
    const formData = formidable({ multiples: true });
    formData.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        var forgot_pass_verify_code = '';
        var length = 50;
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            forgot_pass_verify_code += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        var email = fields.email
        const checkEmail = await Admin.findOne({ where: { admin_email: email } })
        if (!checkEmail) {
            return res.failure({ message: 'Email not found.' });
        }
        var minutesToAdd = 15;
        var currentDate = new Date();
        var for_pass_expiry_time = new Date(currentDate.getTime() + minutesToAdd * 60000);

        let updateData = {
            'pass_verify_code': forgot_pass_verify_code,
            'pass_expiry_time': for_pass_expiry_time,
            'for_pass_status': 0
        };
        await dbService.update(Admin, { admin_email: email }, updateData);

        var resetLink = `${front}${admin}/recover-password/${forgot_pass_verify_code}`
        console.log("resetLink", resetLink)
        if (email) {
            let subject = `Password Reset Request`
            let email_message = await ejs.renderFile(`${__basedir}/views/template/email/forgetPassword.ejs`, { front, resetLink });
            commonFunctions.nodeEmail(email, subject, email_message)
        }
        return res.success({
            data: resetLink,
            message: 'Recover Password Link successfully sent to your email. Please check your Inbox/Spam/Junk Emails.'
        });

    });
}
exports.recoverPassword = async (req, res) => {
    var token = req.params.token
    console.log('token', token)
    let logo = await GeneralSetting.findOne({ attributes: ['id', 'logo'] });

    var users = await Admin.findOne({ where: { 'pass_verify_code': token } });
    console.log('users', users)
    if (users) {
        let email = users.admin_email
        let for_pass_status = users.for_pass_status
        let for_pass_expiry_time = users.pass_expiry_time

        let nowtime = new Date();
        let flag_status = '';
        let msg = '';
        let data = { type: 1, fileName: 'login/updatePassword' }

        if (nowtime > for_pass_expiry_time) {
            flag_status = 1;
            data = { type: 1, fileName: 'login/linkExpire' }
            // msg = "Your Password verification Link is expired now.";
        } else if (for_pass_status == 1) {
            flag_status = 1;
            data = { type: 1, fileName: 'login/passworResetMessage' }
            // msg = "Password already updated by using this link.";
        } else {
            flag_status = 2;
            email = email;
        }

        let token = await commonFunctions.randomString(50)
        let updateData = {
            'pass_verify_code': token,
            'for_pass_status': 1
        };
        await dbService.update(Admin, { 'pass_verify_code': token }, updateData);
        res.render('admin/index', { title: "Update Password", email: email, flag_status: flag_status, msg: msg, data: data, logo })
    } else {
        return res.redirect(admin);
    }

}

exports.submitResetPassword = (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        var password = fields.new_password
        var confirm_password = fields.confirm_password
        var email = fields.email
        if (password !== confirm_password) {
            res.failure({ message: 'Password and Confirm Password do not match. Please ensure both fields are identical.' })
        }
        bcrypt.genSalt(10, function (err, Salt) {
            bcrypt.hash(password, Salt, async function (err, hash) {
                if (err) {
                    return console.log('Cannot encrypt');
                }
                query = { admin_email: email };
                dataToUpdate = {
                    'password': hash,
                    'for_pass_status': 1
                }
                await dbService.update(Admin, query, dataToUpdate);

                return res.send({ status: "success", msg: "Password Succesfully Changed.." });
            })
        })
    });
}