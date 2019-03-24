const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var schema = new Schema({
    product_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    quantity : {
        type : Number,
        default : 1,
        required : true,
        validate : {
           validator :  v => {
            return v >= 1 ? true : false
            },
            message: props => `quantity must greater than 0!`   
        }
    },
    cart_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    discount_id : [mongoose.Schema.Types.ObjectId],
    status : {
        type : Number,
        required : true,
        enum : [-1, 0, 1, 2, 3],
        default : 0
    }, 
    payment_id : mongoose.Schema.Types.ObjectId
});

var Order = mongoose.model('Order', schema);
Order.methods = {};

Order.methods.addOrder = (Order) => {
    return new Order(Order).save();
};

// export module
module.exports = Order;