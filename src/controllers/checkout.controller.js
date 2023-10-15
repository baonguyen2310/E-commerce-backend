const { OK } = require('../core/success.response')
const CheckoutService = require('../services/checkout.service')

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        try {
            const result = await CheckoutService.checkoutReview(req.body)
            return new OK ({
                message: 'checkout review success',
                metadata: result
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CheckoutController()