const express = require('express')
const AccessController = require('../../controllers/access.controller')

const router = express.Router()

//signUp
router.post('/shop/signup', AccessController.signUp)
router.post('/shop/login', AccessController.login)

module.exports = router