'use strict'

const { Types } = require('mongoose')
const { discountModel } = require('../discount.model')

const checkDiscountExist = async ({ model, filter }) => {
    return await model.findOne(filter).lean()
}

const findAllDiscountCodes = async ({
    limit = 50, page = 1, sort = 'ctime', filter, model, select
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean()

    return products
}

module.exports = {
    findAllDiscountCodes,
    checkDiscountExist
}