const { productModel, clothingModel, electronicModel } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')

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

    async createProduct() {
        return await productModel.create(this)
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothingModel.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError({ message: 'create newClothing error' })

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError({ message: 'create newProduct error' })

        return newProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronicModel.create(this.product_attributes)
        if (!newElectronic) throw new BadRequestError({ message: 'create newElectronic error' })

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError({ message: 'create newProduct error' })
        
        return newProduct
    }

}

module.exports = ProductFactory