const mongoose = require("../helpers/MyMongoose").mongoose;
var Types = require("../helpers/MyMongoose").Types;

const validate = require("../helpers/Validator");

var Schema = mongoose.Schema;
var schema = new Schema({
  providerId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Người đăng
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  name: String,
  description: String,
  // Gia san pham
  price: {
    type: Number,
    default: 0
  },
  // Có đang sale hay không
  isSale: {
    type: Boolean,
    default: false
  },
  sale: {
    type: Number, // Phần trăm sale
    default: 0
  },
  // sô lượng tối đa cho phép đặt
  maxOrder: {
    type: Number,
    default: 1
  },
  // Số lượng còn lại
  quantity: {
    type: Number,
    default: 0
  },
  ordered: {
    // Số lượng đã bán
    type: Number,
    default: 0
  },
  isShow: {
    type: Boolean, // Hiển thị hoặc không hiển thị với người dùng
    default: true
  }
});

var Product = {};
Product = mongoose.model("Product", schema);
Product.methods = {};

Product.methods.getList = async (providerId, categoryId, name, isShow = true, from, page, sortf, sortv) => {
  query = validate.validateRemove({ providerId, categoryId, name, isShow }, [undefined]);
  if (name) query.name = new RegExp(`${name}`);

  // Sort
  console.log(sortf, sortv);

  if (sortf) sortf = sortf.split(" ");
  if (sortv) sortv = sortv.split(" ");
  let sort = {};
  for (let i = 0; i < sortf.length; i++) {
    sort[sortf[i]] = sortv[i] || 1;
  }
  console.log(sort);
  console.log("Query", query);
  let result = Product.find(query);
  if (from) result.skip(Number(from));
  if (page) result.limit(Number(page));
  result.populate("categoryId", "name");
  result.populate("providerId", "info _id ");
  result.sort(sort);
  return result.exec();
};

Product.methods.getListByName = name => {
  if (name) return Product.find({ name: new RegExp(`/${name}/`) });
  else return Product.find();
};

async function reduceQuantity(ids, values) {
  return Promise.all(ids.map((id, index) => Product.updateOne({ _id: id }, { $inc: { quantity: -values[index] } })));
}

function getDetail(id, provider, isShow) {
  let query = validate.validateRemove({ _id: id, isShow, providerId: provider }, [undefined]);
  return Product.findOne(query)
    .populate("providerId", "name")
    .populate("categoryId", "name");
}

function updateProduct(id, providerId, newProduct) {
  let query = { _id: id, providerId };
  return Product.updateOne(query, newProduct);
}

Product.methods.reduceQuantity = reduceQuantity;
Product.methods.getDetail = getDetail;
Product.methods.updateProduct = updateProduct;
// export module
module.exports = Product;
