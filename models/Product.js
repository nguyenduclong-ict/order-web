const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;

const validate = require('../helpers/Validate');

var Schema = mongoose.Schema;
var schema = new Schema({
    providerId : mongoose.Schema.Types.ObjectId,
    categoryId : mongoose.Schema.Types.ObjectId,   
    name : String,
    description : String,
    sale : Boolean,
    saleValue : Number,
    maxSold : Number,
    soldAble : Boolean,
    soldCount : {
        type : Number,
        default : 0
    }
});

var Product = {};
Product = mongoose.model('Product', schema);
Product.methods = {};

Product.methods.getList = async (providerId, categoryId, from, page) => {
    from = Number(from);
    page = Number(page);
    query = validate.validateRemove({providerId, categoryId}, [undefined, 'all']); 
    console.log('Query', query);
    return Product.find(query)
        .skip(from)
        .limit(page);
} 


// export module
module.exports = Product;