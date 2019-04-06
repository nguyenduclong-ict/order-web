const mongoose = require('../helpers/MyMongoose').mongoose;

var Schema = mongoose.Schema;
var schema = new Schema({
    user_id : mongoose.Schema.Types.ObjectId,
    path : String,
    type : String,
    isPublic : Boolean,
    created : Date
});

var File = mongoose.model('File', schema);
File.methods = {};

File.methods.addFile = (File) => {
    return new File(File).save();
};

// export module
module.exports = File;