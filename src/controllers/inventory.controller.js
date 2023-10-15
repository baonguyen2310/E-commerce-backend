const InventoryService = require('../services/inventory.service')
const { OK } = require('../core/success.response')

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        try {
            const result = await InventoryService.addStockToInventory({
                ...req.body,
                shopId: req.user.userId
            })

            return new OK({
                message: 'add stock to inventory success',
                metadata: result
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new InventoryController()