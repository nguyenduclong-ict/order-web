const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;

const validate = require('../helpers/Validator');

var Schema = mongoose.Schema;
var schema = new Schema({
    providerId : mongoose.Schema.Types.ObjectId, // Người đăng
    categoryId : mongoose.Schema.Types.ObjectId,   
    name : String,
    description : String,
    price : Number, // Gia san pham
    isSale : Boolean, // Có đang sale hay không 
    sale : Number, // Phần trăm sale
    maxOrder : Number,   // sô lượng tối đa cho phép đặt
    quantity : Boolean, // Số lượng còn lại 
    ordered : { // Số lượng đã bán
        type : Number,
        default : 0
    },
    isShow : Boolean // Hiển thị hoặc không hiển thị với người dùng
});

var Product = {};
Product = mongoose.model('Product', schema);
Product.methods = {};

Product.methods.getList = async (providerId, categoryId, from, page) => {
    from = Number(from);
    page = Number(page);
    query = validate.validateRemove({providerId, categoryId}, [undefined, 'all']); 
    console.log('Query', query);
    query.hide = false;
    return Product.find(query)
        .populate('categoryId')
        .skip(from)
        .limit(page);
};


// export module
module.exports = Product;