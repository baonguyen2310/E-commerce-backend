'use strict'

const ProductService = require('../services/product.service')
const { OK, CREATED } = require('../core/success.response')

class ProductController {
    createProduct = async (req, res, next) => {
        try {
            const newProduct =  await ProductService.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId //product_shop lấy từ userId được decode ra từ middleware authentication
                }
                )
            return new CREATED({
                message: 'created product success',
                metadata: newProduct
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ProductController()