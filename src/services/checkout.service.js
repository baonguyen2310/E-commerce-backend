'use strict'
const { findCartById } = require('../models/repositories/cart.repo')
const { findProductPublishById } = require('../models/repositories/product.repo')
const { BadRequestError } = require('../core/error.response')
const DiscountService = require('./discount.service')

class CheckoutService {

    /* 
        payload do client gửi, kể cả shop_discounts, item_products
        cấu trúc có thể khác so với model cart

        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [
                        {
                            shopId,
                            discountId,
                            codeId,
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]   
                }
            ]
        }
    */

    static async checkoutReview({
        cartId, userId, shop_order_ids
    }) {
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError({ message: 'Cart not exist' })

        const checkout_order = {
            totalPrice: 0, // tổng tiền hàng
            freeShip: 0, // phí vận chuyển
            totalDiscount: 0, // tổng tiền discount
            totalCheckout: 0 // tổng thanh toán
        }
        const shop_order_ids_new = []

        // Tính tổng tiền bill, duyệt qua từng shop
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

            // check product available
            item_products.forEach( async (product) => {
                const foundProduct = await findProductPublishById({
                    product_id: product.product_id
                })
                //if (!foundProduct) throw new BadRequestError({ message: 'order failed' })
            });

            // Tổng tiền hàng của 1 shop
            const checkoutPrice = item_products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // Tổng tiền trước khi discount
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products
            }

            if (shop_discounts.length > 0) {
                const { totalOrder, discountAmount, totalPrice } = await DiscountService.getDiscountAmount({
                    code: shop_discounts[0].codeId, // hard code discount đầu tiên
                    userId: userId,
                    shopId: shopId,
                    products: item_products
                })

                checkout_order.totalDiscount += discountAmount
                checkout_order.totalCheckout += totalPrice
                itemCheckout.priceApplyDiscount = totalPrice
            }

            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}

module.exports = CheckoutService