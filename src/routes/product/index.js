'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.use(authentication)

router.post('', productController.createProduct)

module.exports = router