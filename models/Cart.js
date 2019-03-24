const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var schema = new Schema({
    user_id : mongoose.Schema.Types.ObjectId,
    order_id : [mongoose.Schema.Types.ObjectId]
});

var Cart = mongoose.model('Cart', schema);
Cart.methods = {};

Cart.methods.addCart = (Cart) => {
    return new Cart(Cart).save();
};

// export module
module.exports = Cart;