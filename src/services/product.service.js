const { productModel, clothingModel, electronicModel } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { 
    findAllDraftsForShop, 
    findAllPublishedForShop, 
    publishProductByShop,
    unPublishProductByShop,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../models/repositories/product.repo')

class ProductFactory {
    static async createProduct(type, payload) {
        switch(type) {
            case 'Clothing':
                return new Clothing(payload).createProduct()
            case 'Electronic':
                return new Electronic(payload).createProduct()
            default:
                throw new BadRequestError({ message: `Invalid product type ${type}` })
        }
    }

    static async updateProduct(type, product_id, payload) {
        switch(type) {
            case 'Clothing':
                return new Clothing(payload).updateProduct(product_id)
            case 'Electronic':
                return new Electronic(payload).updateProduct(product_id)
            default:
                throw new BadRequestError({ message: `Invalid product type ${type}` })
        }
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, page, filter })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id })
    }
}

class Product {
    constructor ({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        return await productModel.create({
            ...this,
            _id: product_id
        })
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: productModel })
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothingModel.create({
            ...this.product_attributes, //product_attributes không chứa product_shop
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError({ message: 'create newClothing error' })

        const newProduct = await super.createProduct(newClothing._id) // product dùng chung _id với clothing
        if (!newProduct) throw new BadRequestError({ message: 'create newProduct error' })

        return newProduct
    }

    async updateProduct(productId) {
        const objectParams = this

        if (objectParams.product_attributes) { //nếu có product_attributes thì update clothing model
            await updateProductById({ productId, objectParams, model: clothingModel })
        }

        // update product model
        const updateProduct = await super.updateProduct(productId, objectParams)
        return updateProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronicModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError({ message: 'create newElectronic error' })

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError({ message: 'create newProduct error' })
        
        return newProduct
    }

    async updateProduct(productId) {
        const objectParams = this

        if (objectParams.product_attributes) {
            await updateProductById({ productId, objectParams, model: electronicModel })
        }

        // update product model
        const updateProduct = await super.updateProduct(productId, objectParams)
        return updateProduct
    }
}

module.exports = ProductFactory