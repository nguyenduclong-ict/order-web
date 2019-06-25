const mongoose = require("../helpers/MyMongoose").mongoose;
var Types = require("../helpers/MyMongoose").Types;
const validate = require("../helpers/Validator");

var Schema = mongoose.Schema;
var schema = new Schema({
  name: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  isShow: Boolean,
  created: { type: Date, default: Date.now() }
});
var Category = {};
Category = mongoose.model("Category", schema);
Category.methods = {};

// Thêm category
function add(name, parentId) {
  let data = {};
  if (name) data.name = name;
  if (parentId) data.parentId = parentId;
  data.isShow = true;
  let category = new Category(data);
  return category.save();
}

// Chỉnh sửa
async function edit(id, name, parentId, isShow) {
  console.log(id, name, parentId);
  let data = { name: name, parentId: parentId, isShow };
  for (let field in data) {
    if (!data[field]) delete data[field];
  }
  return Category.updateOne({
    _id: id
  });
}

async function remove(_id) {
  return Category.deleteOne({
    _id: id
  });
}

// Lấy danh sách theo parenId
async function getList(parentId, from = 0, page = 1000, isShow) {
  let query = {};
  if (isShow) query.isShow = isShow;
  if (parentId) query.parentId = parentId;
  let result = Category.find(query);
  result.skip(Number(from));
  result.limit(Number(page));
  result.populate("parentId");
  return result.exec();
}

// Lấy toàn bộ danh sách
async function getListAll() {
  return Category.find({ isShow: true });
}

async function setShow(ids, isShow) {
  return Category.updateMany({ _id: { $in: ids } }, { isShow: isShow });
}

Category.methods.getList = getList;
Category.methods.remove = remove;
Category.methods.add = add;
Category.methods.edit = edit;
Category.methods.setShow = setShow;
Category.methods.getListAll = getListAll;

// export module
module.exports = Category;
