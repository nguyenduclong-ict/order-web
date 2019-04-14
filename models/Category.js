const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;

var Schema = mongoose.Schema;
var schema = new Schema({
    name: String,
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }
});

var Category = mongoose.model('Category', schema);
Category.methods = {};

// Thêm category
function add(name, parentId) {
    let doc = {
        name: name,
        parentId: parentId
    }
    let category = new Category(doc);
    return category.save();
}

// Chỉnh sửa
async function edit(id, name, parentId) {
    let doc = {
        name: name,
        parentId: parentId
    };
    return Category.updateOne({
        _id: id
    }, doc);
}

async function remove(_id) {
    return Category.deleteOne({
        _id: id
    });
}

// Lấy danh sách theo parenId
async function getList(parentId, from, page) {
    let result;
    if (!parentId)
        result = Category.find();
    else
        result = Category.find({
            parentId: parentId
        });
    if (from) result.skip(from);
    if (page) result.limit(page);
    return result;
}

Category.methods.getList = getList;
Category.methods.remove = remove;
Category.methods.add = add;
Category.methods.edit = edit;

// export module
module.exports = Category;