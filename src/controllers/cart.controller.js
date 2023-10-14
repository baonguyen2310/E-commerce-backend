const CartService = require('../services/cart.service')
const { OK, CREATED } = require('../core/success.response')

class CartController {
    addToCart = async (req, res, next) => {
        try {
            const updatedCart = await CartService.addToCart(req.body)

            return new OK({
                message: 'add to cart success',
                metadata: updatedCart
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    updateUserCart = async (req, res, next) => {
        try {
            const updatedCart = await CartService.updateUserCart(req.body)
            
            return new OK({
                message: 'update cart success',
                metadata: updatedCart
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    deleteFromCart = async (req, res, next) => {
        try {
            const deletedFromCart = await CartService.deleteFromCart(req.body)

            return new OK({
                message: 'delete from cart success',
                metadata: deletedFromCart
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    getListUserCart = async (req, res, next) => {
        try {
            const listCart = await CartService.getListUserCart(req.query)

            return new OK({
                message: 'get list user cart success',
                metadata: listCart
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CartController()