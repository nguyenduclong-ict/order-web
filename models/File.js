const mongoose = require('../helpers/MyMongoose').mongoose;
const fs = require('../helpers/fs-extra');
const imagePath = process.env.IMAGE_PATH;
const rootPath = process.env.ROOT_PATH;
const uploadPath = process.env.UPLOAD_PATH;
const tmpPath = process.env.TMP_PATH;
const path = require('path');
const validator = require('../helpers/Validator');

var Schema = mongoose.Schema;
var schema = new Schema({
    owner: mongoose.Schema.Types.ObjectId, // User id
    subOwner: [mongoose.Schema.Types.ObjectId], // Danh sách các docoment liên quan khác
    filename: String, // Tên file
    path: String, // Đường dẫn file 
    type: String, // Loai file
    tags: [String], // 
    isPublic: Boolean, // Co phai public khong
    created: Date // Ngày tạoi 
});
var File = {};
File = mongoose.model('File', schema);
File.methods = {};

File.methods.addFile = (File) => {
    return new File(File).save();
};

File.methods.removeFile = async (filename, owner) => {
    try {
        
        let query = validator.validateRemove({filename, onwer}, [undefined]);
        let file = await File.findOne(query);
        console.log(file);
        if (!file) return false;
        else {
            await File.deleteOne(query);
            let filepath = path.join(rootPath, file.path, file.filename);
            fs.unlinkSync(filepath);
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

File.methods.tmpToUpload = async (filename, newp) => {
    try {
        let file = await File.findOne({filename : filename});
        if(!file) throw new Error('File khong ton tai trong db');

            let src = path.join(rootPath, 'tmp', filename);
            let des = path.join(rootPath, newp, filename);
            fs.copyFileSync(src, des);
            fs.unlinkSync(src);
            await File.updateOne({filename : filename},{path : newp});
            return true;
    } catch(error) {
        console.log(error);
        return false;
    }
}

File.methods.getOne = async (query, fields) => {
    return File.findOne({
        query
    }, fields);
}

File.methods.update = async (filename, owner, data) => {
    try {
        let file = await File.findOne({
            filename: filename,
            owner: owner
        });
        if (!file) throw new Error('File khong ton tai');
        console.log(file);
        if (file.path.includes(tmpPath)) {
            let newp;
            switch (file.type) {
                case 'image': 
                    newp = imagePath;
                    break;
                default : 
                    newp = uploadPath;
            }
            console.log('Begin move file from folder tmp');
            let move = await File.methods.tmpToUpload(file.filename, newp);
            console.log('Move' , move);
            if(move == false) throw new Error('Khong the di chuyen file sang thu muc upload'); 
        } 
        console.log('asdfa' ,data);
        return File.updateOne({filename : filename , owner : owner}, data);
    } catch (error) {
        throw error;
    }
}

// export module
module.exports = File;