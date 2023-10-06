'use strict'

const { productModel, clothingModel, electronicModel } = require('../product.model')

// -------------FOR SHOP------------

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

// ------------END FOR SHOP---------------

// ------------FOR NORMAL USER------------

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: 1 } : { _id: -1} // giả sử nếu ctime thì sort theo id tăng dần
    const products = await productModel.find( filter )
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select({ product_name: 1, product_price: 1, product_thumb: 1 })
    .lean()

    return products
}

const findProduct = async ({ product_id }) => {
    const product = await productModel.findOne({ _id: product_id })
    .select({ __v: 0 })
    .lean()

    return product
}

// ------------END FOR NORMAL USER--------

module.exports = {
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop,
    findAllProducts,
    findProduct
}