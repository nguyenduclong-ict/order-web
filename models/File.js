const mongoose = require("../helpers/MyMongoose").mongoose;
const fs = require("../helpers/fs-extra");
const imagePath = process.env.IMAGE_PATH;
const rootPath = process.env.ROOT_PATH;
const uploadPath = process.env.UPLOAD_PATH;
const tmpPath = process.env.TMP_PATH;
const path = require("path");
const validator = require("../helpers/Validator");

var Schema = mongoose.Schema;
var schema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User"}, // User id
    subOwner: {type: [Schema.Types.ObjectId], default: []}, // Danh sách các docoment liên quan khác
    filename: {type: String, default: ""}, // Tên file
    path: {type: String, default: ""}, // Đường dẫn file
    type: {type: String, default: "none"}, // Loai file
    tags: {type: [String], default: []}, // Phan loai file
    isPublic: {type: Boolean, default: true}, // Co phai public khong
    created: {type: Date, default: Date.now()}
});
var File = {};
File = mongoose.model("File", schema);
File.methods = {};

File.methods.addFile = File => {
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
        let file = await File.findOne({filename: filename});
        if (!file) throw new Error("File khong ton tai trong db");

        let src = path.join(rootPath, "tmp", filename);
        let des = path.join(rootPath, newp, filename);
        fs.copyFileSync(src, des);
        fs.unlinkSync(src);
        await File.updateOne({filename: filename}, {path: newp});
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

File.methods.getOne = async (query, fields) => {
    return File.findOne(
        {
            query
        },
        fields
    );
};

File.methods.update = async (filename, owner, subOwner, isPublic, tags) => {
    return new Promise(async rs => {
        if (subOwner && !Array.isArray(subOwner)) throw new Error("subOwner phai la mang cac id cua document");
        if (!Array.isArray(tags)) throw new Error("tags phai la mang");
        if (typeof isPublic !== "boolean") throw new Error("isPublic phai la kieu Boolean");
        let file = await File.findOne({
            filename: filename,
            owner: mongoose.Types.ObjectId(owner)
        });
        console.log(file);
        if (!file) throw new Error("File khong ton tai");
        console.log(file);
        if (file.path.includes(tmpPath)) {
            let newp;
            switch (file.type) {
                case "image":
                    newp = imagePath;
                    break;
                default:
                    newp = uploadPath;
            }
            console.log("Begin move file from folder tmp");
            let move = await File.methods.tmpToUpload(file.filename, newp);
            console.log("Move", move);
            if (move == false) throw new Error("Khong the di chuyen file sang thu muc upload");
        }
        let data = {};
        if (tags) data.tags = tags;
        if (isPublic) data.isPublic = isPublic;
        if (subOwner) data.subOwner = subOwner;
        console.log("File Model line 102 ", data);

        rs(File.updateOne({filename: filename, owner: owner}, data));
    });
};

File.methods.updateMultilple = async (filename, owner, subOwner, isPublic, tags) => {
    if (subOwner && !Array.isArray(subOwner)) throw new Error("subOwner must is Array of doucument");
    if (filename && !Array.isArray(filename)) throw new Error("filename must is Array of doucument");
    if (!Array.isArray(tags)) throw new Error("tags must is Array ");
    if (typeof isPublic !== "boolean") throw new Error("isPublic must is Boolean");
    let dataUpdate = {};
    if (tags) dataUpdate.tags = tags;
    if (isPublic) dataUpdate.isPublic = isPublic;
    if (subOwner) dataUpdate.subOwner = subOwner;

    return File.updateMany({filename: {$in: filename}, owner: owner}, dataUpdate);
};

// export module
module.exports = File;
