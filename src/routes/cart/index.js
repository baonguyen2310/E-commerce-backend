'use strict'

const express = require('express')
const cartController = require('../../controllers/cart.controller')

const router = express.Router()

// for normal user
router.post('/add_to_cart', cartController.addToCart)
router.post('/update_cart', cartController.updateUserCart)
router.delete('/delete_from_cart', cartController.deleteFromCart)
router.get('/get_list_cart', cartController.getListUserCart)

module.exports = router