const mongoose = require('../helpers/MyMongoose').mongoose;

var Schema = mongoose.Schema;
var schema = new Schema({
    startDate: { // Ngày bắt đẩu áp dụng
        type: Date,
        required: true
    },
    endDate: { // ngày hết hạn
        type: Date,
        required: true
    },
    status: Boolean, // Co the ap dung khong?
    value: { // Phần trăm giảm giá
        type: Number,
        required: () => {
            return this.value > 0;
        },
        default: 0
    },
    type: { // Áp dụng cho 1 sản phẩm hay  1 nhóm sản phẩm
        type: String,
        enum: ['single', 'group'],
        required: [true, 'type required!']
    },
    productId: [mongoose.Schema.Types.ObjectId], // Nếu áp dụng cho 1 sản phẩm nhất định,
    categoryId: [mongoose.Schema.Types.ObjectId] // Nếu áp dụng cho 1 nhóm sản phẩm
});
var Discount = {};
Discount = mongoose.model('Discount', schema);
Discount.methods = {};

Discount.methods.addDiscount = (Discount) => {
    return new Discount(Discount).save();
};

// export module
module.exports = Discount;