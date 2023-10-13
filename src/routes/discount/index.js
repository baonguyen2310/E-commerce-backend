'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

// for user | shop
router.post('/amount', discountController.getDiscountAmount)
router.get('/list_product_code', discountController.getProductsByDiscountCode)

// for shop
router.use(authentication)

router.post('', discountController.createDiscountCode)
router.get('', discountController.getAllDiscountCodesByShop)

module.exports = router