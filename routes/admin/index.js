// moduls
const router = require('express').Router();
const formidable = require('formidable');
const fs = require('fs')


const loginController = require('../../controllers/admin/loginController')
const dashboardController = require('../../controllers/admin/dashboardController')
const commonController = require('../../controllers/admin/commonController')

// upload file
router.post('/upload-attach-file', (req, res, next) => {
    const formData = formidable({ multiples: true });
    formData.parse(req, async (err, fields, files) => {
        if (err) {
            return next(err);
        }
        // Safeguard to ensure all necessary fields are present
        if (!fields.path || !fields.type || !fields.names || !fields.validsize || !files.file) {
            // console.log('message:', 'Missing required fields')
            return res.failure({ message: 'Missing required fields' });
        }

        // Extract values from fields
        const myPath = fields.path;
        const type = fields.type;
        const myFilename = fields.names;
        const validSize = parseInt(fields.validsize, 10);
        const ext = myFilename.split('.').pop().toLowerCase(); // Ensure the extension is in lowercase
        const file = files.file;

        // File size in KB
        const sizeInKB = Math.ceil(file.size / 1024);
        const oldPath = file.filepath;
        let filename = Date.now() + '_' + file.originalFilename.replace(/\s/g, '');
        const newPath = `public/${myPath}/${filename}`;
        var rawData = fs.readFileSync(oldPath)

        // Function to format file size
        const formatFileSize = (sizeInKB) => {
            return sizeInKB < 1024 ? `${sizeInKB} KB` : `${(sizeInKB / 1024).toFixed(2)} MB`;
        };

        // Function to save file
        const saveFile = () => {
            fs.writeFile(newPath, rawData, (err) => {
                if (err) {
                    return res.failure({ message: err.message });
                }
                return res.success({ message: 'Logo Upload Seccessfully', data: { filename: filename } });

            });
        };

        // Validate file type and size based on 'type'
        const fileTypes = {
            1: ['jpg', 'jpeg', 'png', 'webp',],
            2: ['pdf'],
            3: ['xlsx', 'xlsm', 'xlsb', 'xltx'],
            4: ['pdf', 'doc', 'docx', 'txt'],
            5: ['*'] // All files
        };

        if (!fileTypes[type]) {
            // return res.send({ response: 'error', msg: 'Invalid file type', filename: '' });
            return res.failure({ message: 'Invalid file type' });
        }

        if (fileTypes[type].includes(ext) || fileTypes[type][0] === '*') {
            if (sizeInKB > validSize) {
                return res.failure({ message: `Size Must Be Less Than ${formatFileSize(validSize)}` });
            }
            saveFile();
        } else {
            return res.failure({ message: `Invalid file type. Allowed: ${fileTypes[type].join(', ')}` });
        }
    });
});

// delete file
router.post('/delete-attach-file', (req, res) => {
    var pathToFile = 'public/' + req.body.path + req.body.filename
    fs.unlink(pathToFile, function (err) {
        if (err) {
            return res.send({ status: "error" });
        } else {
            return res.send({ status: "success" });
        }
    })
})

// table 
router.post('/update-status', commonController.updateStatus)

// authontication
const Auth = require('../../middleware/adminauth')
const NoAuth = require('../../middleware/adminnoauth')

// login or logout
router.get('/', NoAuth.adminNoAuth, loginController.index);
router.get('/logout', Auth.adminAuth, loginController.logout);
router.post('/admin-login-check', loginController.adminLoginCheck);

// forget password
router.get('/forgot-pws', loginController.forgotPws);
router.post('/check-email', loginController.checkEmail)
router.post('/forgot-password', loginController.forgotPassword)
router.get('/recover-password/:token', NoAuth.adminNoAuth, loginController.recoverPassword)
router.post('/submit-reset-password', loginController.submitResetPassword)

// Dashboard 
router.get('/dashboard', Auth.adminAuth, dashboardController.dashboard);
router.get('/profile', Auth.adminAuth, dashboardController.profile);

router.post('/update-profile', dashboardController.updateProfile)
router.post('/update-general-settings', dashboardController.updateGeneralSettings)
router.post('/check-old-password', dashboardController.checkOldPassword)
router.post('/update-admin-password', dashboardController.updateAdminPassword)
router.post('/change-logo-image', dashboardController.changeLogoImage)


// import routers
router.use(require('./test'));


module.exports = router;