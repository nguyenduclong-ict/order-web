const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;

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

Product.methods.getList = (providerId, categoryId, from, page) => {
    query = {};
    if(providerId) query.providerId = providerId;
    let find = Product.find(query).exec();  
    if(categoryId) find.populate('categoryId');
} 


// export module
module.exports = Product;