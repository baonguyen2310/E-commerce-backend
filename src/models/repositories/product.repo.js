'use strict'

const { productModel, clothingModel, electronicModel } = require('../product.model')

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const queryProduct = async ({ query, limit, skip }) => {
    return await productModel.find(query)
    .populate('product_shop', 'name email -_id') // giống JOIN, khi tạo model cần khai báo objectId và ref
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec() // xử lý lỗi và kết quả bất đồng bộ bằng callback
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundProductInShop = await productModel.findOne({
        product_shop: product_shop, // product_shop trong product và trong req.user giống nhau
        _id: product_id
    })
    if (!foundProductInShop) return null

    foundProductInShop.isDraft = false
    foundProductInShop.isPublished = true
    const { modifiedCount } = await foundProductInShop.updateOne(foundProductInShop)

    return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundProductInShop = await productModel.findOne({
        product_shop: product_shop,
        _id: product_id
    })
    if (!foundProductInShop) return null

    foundProductInShop.isDraft = true
    foundProductInShop.isPublished = false
    const { modifiedCount } = await foundProductInShop.updateOne(foundProductInShop)

    return modifiedCount
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop
}