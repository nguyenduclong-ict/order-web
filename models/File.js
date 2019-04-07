const mongoose = require('../helpers/MyMongoose').mongoose;

var Schema = mongoose.Schema;
var schema = new Schema({
    owner : mongoose.Schema.Types.ObjectId, // User id
    filename : String,
    type : String, // Loai file
    isPublic : Boolean, // Co phai public khong
    created : Date
});

var File = mongoose.model('File', schema);
File.methods = {};

File.methods.addFile = (File) => {
    return new File(File).save();
};

// export module
module.exports = File;