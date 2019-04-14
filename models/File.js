const mongoose = require('../helpers/MyMongoose').mongoose;
const fs = require('fs');

var Schema = mongoose.Schema;
var schema = new Schema({
    owner : mongoose.Schema.Types.ObjectId, // User id
    subOwner : [mongoose.Schema.Types.ObjectId],
    filename : String,
    path : String,
    type : String, // Loai file
    of : [String],
    isPublic : Boolean, // Co phai public khong
    created : Date
});

var File = mongoose.model('File', schema);
File.methods = {};

File.methods.addFile = (File) => {
    return new File(File).save();
};

File.methods.removeFile = async (filename) => {
    File.findOne({filename : filename})
        .then(file => {
            if(file) {
                fs.unlinkSync(file.path);
                return true;
            }
        })
        .catch(error => {
            throw error;
        });
};


// export module
module.exports = File;