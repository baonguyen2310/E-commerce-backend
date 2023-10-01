const express = require('express')
const AccessController = require('../../controllers/access.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

//signUp
router.post('/shop/signup', AccessController.signUp)
router.post('/shop/login', AccessController.login)

//authentication
router.use(authentication)

//logout
router.post('/shop/logout', AccessController.logout)

module.exports = router