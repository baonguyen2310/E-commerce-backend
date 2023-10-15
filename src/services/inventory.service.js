'use strict'

const { inventoryModel } = require('../models/inventory.model')
const { findProduct } = require('../models/repositories/product.repo')
const { BadRequestError } = require('../core/error.response')
const { convertToObjectIdMongoDB } = require('../utils')

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '123, Tran Phu, HCM City'
    }) {
        const product = await findProduct({ product_id: productId })
        if(!product) throw new BadRequestError({ message: 'product not exist' })

        const filter = { 
            inven_shopId: convertToObjectIdMongoDB(shopId),
            inven_productId: convertToObjectIdMongoDB(productId)
        }
        const update = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }
        const options = {
            upsert: true,
            new: true
        }

        return await inventoryModel.findOneAndUpdate(filter, update, options)
    }
}

module.exports = InventoryService