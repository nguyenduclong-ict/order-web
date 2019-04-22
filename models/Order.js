const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var schema = new Schema({
    productId: { // Link đến sản phẩm
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    product : { // Dữ liệu của sản phẩm tại thời điểm đặt hàng
        
    },
    paymentId: mongoose.Schema.Types.ObjectId,
    customerId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    providerId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    discountId: [mongoose.Schema.Types.ObjectId],
    quantity: { // Số lượng đặt hàng
        type: Number,
        default: 1,
        required: true,
        validate: {
            validator: v => v > 0,
            message: props => `quantity must greater than 0!`
        }
    },
    totalPay : { // Tổng thanh toán
        type : Number, 
        default : 0,
        validate : {
            validator : v => v > 0,
            message : props => `total pay must greater than 0!`
        }
    },
    status: [{
        code: {
            // 0 : Chờ xác nhận,  1 : Đã xác nhận, 2 : Đang giao , 3 : Hoàn thành, 4 : Bị huỷ
            type: Number,
            enum: [0, 1, 2, 3, 4],
            default : 0
        }, 
        comment: String,
        time: {
            type: Date,
            default: Date.now()
        }
    }]
});

var Order = mongoose.model('Order', schema);
Order.methods = {};

Order.methods.addOrder = (Order) => {
    return new Order(Order).save();
};

// export module
module.exports = Order;