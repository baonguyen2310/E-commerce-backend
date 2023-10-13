const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema({
    discount_name: {
        type: String,
        require: true
    },
    discount_description: {
        type: String,
        require: true
    },
    discount_type: { // theo số tiền (fixed_amount) hoặc theo phần trăm (percentage)
        type: String,
        default: 'fixed_amount' 
    },
    discount_value: { // 10.000 or 10%
        type: Number,
        require: true
    },
    discount_code: { // code của discount
        type: String,
        require: true
    },
    discount_start_date: {
        type: Date,
        require: true
    },
    discount_end_date: {
        type: Date,
        require: true
    },
    discount_max_uses: { // số lượng discount tối đa
        type: Number,
        require: true
    },
    discount_max_uses_per_user: { // số lượng discount tối đa cho mỗi user
        type: Number,
        require: true
    },
    discount_users_used: { // các user đã sử dụng discount
        type: Array,
        default: []
    },
    discount_used_count: { // số lượng discount đã sử dụng
        type: Number,
        require: true
    },
    discount_min_order_value: { // giá trị đơn hàng tối thiểu
        type: Number,
        require: true
    },
    discount_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    discount_is_active: {
        type: Boolean,
        default: true
    },
    discount_applies_to: { // áp dụng cho toàn bộ hay chỉ một số sản phẩm
        type: String,
        require: true,
        enum: ['all', 'specific']
    },
    discount_product_ids: { // các sản phẩm được áp dụng
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    discountModel: model(DOCUMENT_NAME, discountSchema)
}