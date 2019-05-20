const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;

var Schema = mongoose.Schema;
var schema = new Schema({
    owner : { type : Schema.Types.ObjectId, ref : 'User'}, // User id
    subOwner : [Schema.Types.ObjectId],
    comment :  String,
    time : Date,
    isShow : Boolean,
    created: { type: Date, default: Date.now() }
});

var Comment;
Comment = mongoose.model('Comment', schema);
Comment.methods = {};

// export module
module.exports = Comment;