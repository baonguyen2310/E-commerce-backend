const { cartModel } = require('../cart.model')
const { convertToObjectIdMongoDB } = require('../../utils')

// ĐỂ TỐI ƯU HOÁ CÂU QUERY THÌ: CÓ THỂ VỪA CHECK, VỪA TẠO, VỪA CẬP NHẬT TRONG CÙNG 1 CÂU

const checkUserCartExist = async ({ userId }) => {
    return await cartModel.findOne({ cart_userId: userId })
}

const createUserCart = async ({ userId }) => {
    return await cartModel.create({ cart_userId: userId })
}

const updateProductInCart = async ({ userId, product }) => {
    const { productId, quantity } = product
    const filter = {
        cart_userId: userId,
        'cart_products.productId': productId
    }
    const update = {
        $inc: { 'cart_products.$.quantity': quantity } // quantity là lượng tăng thêm (âm | dương)
    }
    const options = {
        new: true
    }
    return await cartModel.findOneAndUpdate(filter, update, options)
}

const findCartById = async (cartId) => {
    return await cartModel.findOne({ 
        _id: convertToObjectIdMongoDB(cartId),
        cart_state: 'active'
    }).lean()
}

module.exports = {
    checkUserCartExist,
    createUserCart,
    updateProductInCart,
    findCartById
}