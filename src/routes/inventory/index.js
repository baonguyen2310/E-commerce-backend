const express = require('express')
const inventoryController = require('../../controllers/inventory.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.use(authentication)

router.post('/add_stock_to_inventory', inventoryController.addStockToInventory)

module.exports = router