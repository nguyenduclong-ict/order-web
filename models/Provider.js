const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;

var Schema = mongoose.Schema;
var schema = new Schema({
    name : String,
    address : String,
    phone : Types.phone,
    avatar : Types.image,
    account_id : mongoose.Schema.Types.ObjectId
});

var Provider = mongoose.model('Provider', schema);
Provider.methods = {};

// export module
module.exports = Provider;