const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventorySchema = new Schema({
    inven_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    inven_location: {
        type: String,
        default: 'unknown'
    },
    inven_stock: { //số lượng hàng tồn kho của sản phẩm
        type: Number,
        require: true
    },
    inven_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    inven_reservations: { // đặt hàng trước
        type: Array,
        default: []
    }
    /*  Dạng của inven_reservation
        cardId,
        stock, //số lượng đặt
        createdOn
    */
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    inventoryModel: model(DOCUMENT_NAME, inventorySchema)
}