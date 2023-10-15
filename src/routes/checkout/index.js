'use strict'

const express = require('express')
const checkoutController = require('../../controllers/checkout.controller')

const router = express.Router()

router.post('/review', checkoutController.checkoutReview)

module.exports = router