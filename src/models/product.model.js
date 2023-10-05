'use strict'

const { model, Schema, Types } = require('mongoose')
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, require: true },
    product_description: { type: String },
    product_slug: { type: String },
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_type: { type: String, require: true, enum: ['Clothing', 'Electronic', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, require: true },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be under 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] }, // các biến thể
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

// Document middleware: run before .save() or .create() ...
productSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name, {lower: true})
    next()
})

const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: { type: String },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
    collection: 'Clothings'
})

const electronicSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: { type: String },
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
    collection: 'Electronics'
})

module.exports = {
    productModel: model(DOCUMENT_NAME, productSchema),
    clothingModel: model('Clothing', clothingSchema),
    electronicModel: model('Electronic', electronicSchema)
}