'use strict'
const { cartModel } = require('../models/cart.model')
const { 
    checkUserCartExist,
    createUserCart,
    updateProductInCart
} = require('../models/repositories/cart.repo')
const { findProductPublishById } = require('../models/repositories/product.repo')
const { BadRequestError } = require('../core/error.response')


/*
    Cart Service
    1 - add product to cart [user]
    2 - reduce product quantity by one [user]
    3 - increase product quantity by one [user]
    4 - get cart [user]
    5 - delete cart [user]
    6 - delete cart item [user]
*/

class CartService {

    static async addToCart({ userId, product = {} }) {
        const { productId, quantity } = product

        // check productId publish
        const foundProductPublish = await findProductPublishById({ product_id: productId })
        if (!foundProductPublish) {
            throw new BadRequestError({ message: 'not found product publish' })
        }

        // check user cart exist
        let foundCart = await checkUserCartExist({ userId })
        if (!foundCart) {
            foundCart = await createUserCart({ userId })
        }

        // check product in user card
        const foundProductInCart = foundCart.cart_products.find((cart_product) => {
            return cart_product.productId == productId
        })
        if (!foundProductInCart) {
            foundCart.cart_products.push(product)
            return await foundCart.save()
        } else {
            return await updateProductInCart({ userId, product })
        }
    }

    // update cart


    /*
        shop_order_ids: [
            shopId,
            item_products: [
                { quantity, price, shopId, old_quantity, productId }
            ],
            version
        ]
    */

    static async updateUserCart({ userId, product = {} }) {
        const { productId, quantity, old_quantity } = product

        // check product exist
        const foundProductPublish = await findProductPublishById({ product_id: productId })
        if (!foundProductPublish) {
            throw new BadRequestError({ message: 'not found product publish' })
        }

        if (quantity == 0) {
            // delete
        }

        // check user cart exist
        let foundCart = await checkUserCartExist({ userId })
        if (!foundCart) {
            foundCart = await createUserCart({ userId })
        }

        // check product in user card
        const foundProductInCart = foundCart.cart_products.find((cart_product) => {
            return cart_product.productId == productId
        })

        if (foundProductInCart) {
            return await updateProductInCart({
                userId,
                product: {
                    productId,
                    quantity: quantity - old_quantity   // lượng tăng thêm
                }
            })
        }
    }

    static async deleteFromCart({ userId, product }) {
        const { productId } = product
        const filter = {
            cart_userId: userId,
            cart_state: 'active'
        }
        const update = {
            $pull: { cart_products: { productId } }
        }
        return await cartModel.updateOne(filter, update)
    }

    static async getListUserCart({ userId }) {
        const listUserCart =  await cartModel.findOne({
            cart_userId: userId
        }).lean()

        if (!listUserCart) throw new BadRequestError({ message: 'not found user cart' })
        
        return listUserCart
    }
}

module.exports = CartService