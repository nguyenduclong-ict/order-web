const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;

var Schema = mongoose.Schema;
var schema = new Schema({
    title : String,
    content : String,
    type : String,
    created : Date
});

var Log;
Log = mongoose.model('Log', schema);
Log.methods = {};

schema.pre('save', (next) => {
    this.create = Date.now();
    next();
});

Log.methods.addLog = (title, content, type) => {
    let newLog = new Log({title, content, type});
    newLog.save();
}

// export module
module.exports = Log;