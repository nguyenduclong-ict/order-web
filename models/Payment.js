const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var schema = new Schema({
    name : {
        type : String,
        required : true
    }, 
    description : {
        type : String ,
        required : true
    }
});

var Discount = mongoose.model('Discount', schema);
Discount.methods = {};

Discount.methods.addDiscount = (Discount) => {
    return new Discount(Discount).save();
};

// export module
module.exports = Discount;