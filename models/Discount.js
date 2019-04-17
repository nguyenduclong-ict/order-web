const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var schema = new Schema({
    startdate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: Number,
        enum: [0, 1], // Chua su dung, da su dung
        default: [0]
    },
    value: {
        type: Number,
        required: () => {
            return this.value > 0;
        },
        default: 0
    },
    type: {
        type: String,
        enum: ['single', 'group'],
        required: [true, 'type required!']
    },
    product_id: [mongoose.Schema.Types.ObjectId],
    category_id: [mongoose.Schema.Types.ObjectId]
});
var Discount = {};
Discount = mongoose.model('Discount', schema);
Discount.methods = {};

Discount.methods.addDiscount = (Discount) => {
    return new Discount(Discount).save();
};

// export module
module.exports = Discount;