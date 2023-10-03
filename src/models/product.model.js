'use strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, require: true },
    product_description: { type: String },
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_type: { type: String, require: true, enum: ['Clothing', 'Electronic', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, require: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: { type: String },
    material: { type: String }
}, {
    timestamps: true,
    collection: 'Clothings'
})

const electronicSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: { type: String },
    color: { type: String }
}, {
    timestamps: true,
    collection: 'Electronics'
})

module.exports = {
    productModel: model(DOCUMENT_NAME, productSchema),
    clothingModel: model('Clothing', clothingSchema),
    electronicModel: model('Electronic', electronicSchema)
}