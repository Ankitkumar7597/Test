const router = require('express').Router()

// Image upload middleware
// const upload = require('../../middleware/imageUpload');
const dynamicUpload = require('../../middleware/imageUpload');


const testController = require('../../controllers/admin/testController')

// authontication
const Auth = require('../../middleware/adminauth')
const NoAuth = require('../../middleware/adminnoauth')

//file config
const config = {
    image: {
        inputName: "image",
        directory: `${__basedir}/public/uploads/test`,
        maxFileSize: 1 * 1024 * 1024, // 1 MB
        allowedExtensions: /jpeg|jpg|png/,
    },
    profilePicture: {
        inputName: "profilePicture",
        directory: `${__basedir}/public/uploads/profile-pictures`,
        maxFileSize: 1 * 1024 * 1024, // 1 MB
        allowedExtensions: /jpeg|jpg|png/,
    },
    documents: {
        inputName: "document",
        directory: `${__basedir}/public/uploads/documents`,
        maxFileSize: 5 * 1024 * 1024, // 5 MB
        allowedExtensions: /pdf|docx|txt/,
    },
};


router.get('/sub-h-1', Auth.adminAuth, testController.subH1)
router.get('/add-from/:any', Auth.adminAuth, testController.addForm)


router.post("/submit-add-form", dynamicUpload(config.image), testController.submitAddForm);
router.post('/form-list-grid-data', testController.formListGridData)


module.exports = router