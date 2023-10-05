'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.use(authentication)

router.post('', productController.createProduct)

router.get('/drafts/all', productController.getAllDraftsForShop)
router.get('/published/all', productController.getAllPublishedForShop)
router.post('/publish/:id', productController.publishProductByShop)
router.post('/unpublish/:id', productController.unPublishProductByShop)

module.exports = router