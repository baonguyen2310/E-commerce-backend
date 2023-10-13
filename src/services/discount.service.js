'use strict'
const { BadRequestError } = require('../core/error.response')
const { discountModel } = require('../models/discount.model')
const { convertToObjectIdMongoDB } = require('../utils')
const { findAllProducts } = require('../models/repositories/product.repo')
const { checkDiscountExist, findAllDiscountCodes } = require('../models/repositories/discount.repo')

/*
    Discount Services
    1 - generate discount code [shop | admin]
    2 - get discount amount [user]
    3 - get all discount codes [user | shop]
    4 - verify discount code [user]
    5 - delete discount code [shop | admin]
    6 - cancel discount code [user]
*/

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, name, description, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, 
            type, value, users_used, max_uses, used_count, max_uses_per_user
        } = payload

        // handle service (kiem tra): should use builder pattern
        // lúc tạo thì ngày hiện tại phải <= ngày bắt đầu
        if (new Date() > new Date(start_date) || new Date(start_date) > new Date(end_date)) {
            throw new BadRequestError({ message: 'Discount code has expired' })
        }

        const foundDiscount = await checkDiscountExist({
            model: discountModel,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongoDB(shopId) //nhận từ client vào nên cần convert từ string thành objectId
            }
        })

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError({ message: 'Discount has existed' })
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_max_uses_per_user: max_uses_per_user,
            discount_users_used: users_used,
            discount_used_count: used_count,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to == 'all' ? [] : product_ids
        })

        return newDiscount
    }

    static async getProductsByDiscountCode({
        code, shopId, userId, limit, page
    }) {
        const foundDiscount = await checkDiscountExist({
            model: discountModel,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongoDB(shopId)
            }
        })

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError({ message: 'discount code not exist' })
        }

        const { 
            discount_applies_to,
            discount_product_ids
        } = foundDiscount

        let products
        if (discount_applies_to == 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongoDB(shopId),
                    isPublished: true
                },
                limit: limit,
                sort: 'ctime',
                page: page
            })
        }
        if (discount_applies_to == 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublished: true
                },
                limit: limit,
                sort: 'ctime',
                page: page
            })
        }

        return products
    }

    static async getAllDiscounCodesByShop({ shopId, limit, page }) {
        const discounts = await findAllDiscountCodes({
            limit: limit,
            page: page,
            filter: {
                discount_shopId: convertToObjectIdMongoDB(shopId),
                discount_is_active: true
            },
            model: discountModel
        })

        return discounts
    }

    /*
        Apply Discount Code
        products = [
            {productId, shopId, quantity, name, price},
            {productId, shopId, quantity, name, price}
        ]
    */

    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExist({
            model: discountModel,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongoDB(shopId)
            }
        })

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError({ message: 'discount code not exist' })
        }

        const {
            discount_max_uses,
            discount_used_count,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value
        } = foundDiscount

        if (discount_used_count >= discount_max_uses) {
            throw new BadRequestError({ message: 'discount are out' }) // hết số lượng discount
        }

        // lúc dùng thì ngày hiện tại phải >= ngày bắt đầu và <= ngày kết thúc
        // if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
        //     throw new BadRequestError({ message: 'discount code has expired' })
        // }

        // check xem có set giá trị tối thiểu hay không
        // *** THIẾU CHECK PRODUCT CÓ ĐÚNG PRODUCT ĐƯỢC DISCOUNT KHÔNG
        // Đang dùng price từ client, phải kiểm tra lại trên database
        const totalOrder = products.reduce((acc, product) => {
            console.log(acc)
            return acc + product.quantity * product.price
        }, 0)

        if (discount_min_order_value > 0) {
            if (totalOrder < discount_min_order_value) {
                throw new BadRequestError({ 
                    message: `discount require min order value ${discount_min_order_value}` 
                })
            }
        }

        // check số lần sử dụng tối đa của mỗi user
        if (discount_max_uses_per_user > 0) {
            // số lần userId này đã sử dụng discount
            const userUsedDiscountCount = discount_users_used.filter(userUsed => userId == userUsed).length
            if (userUsedDiscountCount >= discount_max_uses_per_user) {
                throw new BadRequestError('discount are out for this user')
            }
        }

        // check xem loại discount là fixed_amount hay percentage
        const discountAmount = discount_type == 'fixed_amount' ? discount_value : totalOrder * discount_value / 100

        return {
            totalOrder: totalOrder,
            discountAmount: discountAmount,
            totalPrice: totalOrder - discountAmount
        }
    }


    /*
        Có 3 cách để xoá dữ liệu:
        1 - Xoá hoàn toàn khỏi database: Not recommend
        2 - Dùng thêm 1 trường isDelete: Not recommend, lý do giảm perfomance: vì phải duyệt qua dữ liệu đã xoá
        3 - Đưa dữ liệu đã xoá vào 1 database khác, và ghi lịch sử: Recommend
    */
    static async deleteDiscountCode({ code, shopId }) {
        // Có thể check và xử lý một số thứ trước khi xoá

        const deleted = await discountModel.findOneAndDelete({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoDB(shopId)
        })
        return deleted
    }

    static async cancelDiscountCodeByUser({ code, shopId, userId }) {
        const foundDiscount = await checkDiscountExist({
            model: discountModel,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongoDB(shopId)
            }
        })

        if (!foundDiscount) throw new BadRequestError({ message: 'discount not exist' })

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: { discount_users_used: userId },
            $inc: {
                discount_used_count: -1
            }
        })

        return result
    }
}

module.exports = DiscountService