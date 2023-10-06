'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

// FOR NORMAL USER not must has authentication
router.get('', productController.getAllProducts)
router.get('/:id', productController.getProduct)

// FOR SHOP must has authentication
router.use(authentication)

router.post('', productController.createProduct)

router.get('/drafts/all', productController.getAllDraftsForShop)
router.get('/published/all', productController.getAllPublishedForShop)
router.post('/publish/:id', productController.publishProductByShop)
router.post('/unpublish/:id', productController.unPublishProductByShop)

module.exports = router