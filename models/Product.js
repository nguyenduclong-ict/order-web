const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;

var Schema = mongoose.Schema;
var schema = new Schema({
    name : String,
    description : String,
    sale : Boolean,
    saleValue : Number,
    quantity : {
        type : Number,
        default : 0,
        required : true,
        validate : {
           validator :  v => {
            return v >= 0 ? true : false
            },
            message: props => `quantity must greater than 0!`   
        }
    },
    provider_id : mongoose.Schema.Types.ObjectId,
    category_id : mongoose.Schema.Types.ObjectId,   
    bought : {
        type : Number,
        default : 0
    }
});

var Product = mongoose.model('Product', schema);
Product.methods = {};

// export module
module.exports = Product;