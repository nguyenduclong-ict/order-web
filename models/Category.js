const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;

var Schema = mongoose.Schema;
var schema = new Schema({
    name : String,
    image : Types.image,
    parent_id : mongoose.Schema.Types.ObjectId
});

var Category = mongoose.model('Category', schema);
Category.methods = {};

// export module
module.exports = Category;