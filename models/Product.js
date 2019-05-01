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

Product.methods.getList = async (providerId, categoryId, from, page) => {
  from = Number(from);
  page = Number(page);
  query = validate.validateRemove({ providerId, categoryId }, [
    undefined,
    "all"
  ]);
  console.log("Query", query);
  query.isShow = false;
  return Product.find(query)
    .populate("categoryId")
    .skip(from)
    .limit(page);
};

Product.methods.getListByName = name => {
  if (name) return Product.find({ name: new RegExp(`/${name}/`) });
  else return Product.find();
};

// export module
module.exports = Product;
