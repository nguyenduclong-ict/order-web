const mongoose = require("../helpers/MyMongoose").mongoose;
var Types = require("../helpers/MyMongoose").Types;
const Log = require("./Log");
const validate = require("../helpers/Validator");
const Category = require("./Category");

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
  },
  created: { type: Date, default: Date.now() }
});

var Product = {};
Product = mongoose.model("Product", schema);
Product.methods = {};

Product.methods.getList = async (providerId, categoryId, name, isShow = true, from, page, sort) => {
  query = validate.validateRemove({ providerId, name, isShow }, [undefined]);
  if (name) query.name = new RegExp(`${name}`);

  // Dieu kien tim kiếm theo category
  if (categoryId) {
    arr = categoryId.split("|").filter(e => e !== "");
    let arr2 = await Category.find({parentId : {$in : arr}})
    arr2 = [ ...arr,... arr2.map(e => e._id.toString())]
    query.categoryId = {
      $in: arr2
    };
  }

  // Sort
  if (sort) {
    let arr = sort.split("|").filter(e => e !== "");
    sort = {};
    for (let i = 0; i < arr.length; i = i + 2) {
      sort[arr[i]] = arr[i + 1];
    }
  } else {
    sort = {};
  }
  console.debug("Query", query , 'Sort ', sort);
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
  if (newProduct.ordered) delete newProduct.ordered;
  let query = { _id: id, providerId };
  Log.methods.addLog("Update Product", newProduct, "update");
  return Product.updateOne(query, newProduct);
}

function addProduct(data) {
  if (data.ordered) delete data.ordered;
  let product = new Product(data);
  Log.methods.addLog("Add Product", product, "create");
  return product.save();
}

Product.methods.reduceQuantity = reduceQuantity;
Product.methods.getDetail = getDetail;
Product.methods.updateProduct = updateProduct;
Product.methods.addProduct = addProduct;
// export module
module.exports = Product;
