'use strict'
const DiscountService = require('../services/discount.service')
const { OK, CREATED } = require('../core/success.response')

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        try {
            const newDiscount = await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
            
            return new CREATED({
                message: 'create new discount code success',
                metadata: newDiscount
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    getProductsByDiscountCode = async (req, res, next) => {
        try {
            const products = await DiscountService.getProductsByDiscountCode({
                ...req.body
            })

            return new OK({
                message: 'get products by discount code success',
                metadata: products
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    getAllDiscountCodesByShop = async (req, res, next) => {
        try {
            const discounts = await DiscountService.getAllDiscounCodesByShop({
                shopId: req.user.userId,
                ...req.query
            })

            return new OK({
                message: 'get all discount codes by shop success',
                metadata: discounts
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    getDiscountAmount = async (req, res, next) => {
        try {
            const result = await DiscountService.getDiscountAmount({
                ...req.body
            })

            return new OK({
                message: 'get discount amount success',
                metadata: result
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new DiscountController()