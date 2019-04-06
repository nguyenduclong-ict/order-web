const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var schema = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    payment_id: mongoose.Schema.Types.ObjectId,
    customer_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    provider_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    discount_id: [mongoose.Schema.Types.ObjectId],
    quantity: {
        type: Number,
        default: 1,
        required: true,
        validate: {
            validator: v => {
                return v >= 1 ? true : false
            },
            message: props => `quantity must greater than 0!`
        }
    },
    status: [{
        code: {
            type: Number,
            enum: [-1,0, 1, 2, 3, 4],
            default : 0
        }, // -1 : Trong giỏ hàng, 0 : Chờ xác nhận,  1 : Đã xác nhận, 2 : Đang giao , 3 : Hoàn thành, 4 : Bị huỷ
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