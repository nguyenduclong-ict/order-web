const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;

var Schema = mongoose.Schema;
var schema = new Schema({
    owner : mongoose.Schema.Types.ObjectId, // User id
    subOwner : [mongoose.Schema.Types.ObjectId],
    comment :  String,
    time : Date
});

var File = mongoose.model('File', schema);
File.methods = {};

// export module
module.exports = File;