const router = require('express').Router()

const logincontroller = require('../../controllers/restfulapi/logincontroller')

router.post('/login', logincontroller.login)

module.exports = router