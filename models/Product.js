const mongoose = require("../helpers/MyMongoose").mongoose;
var Types = require("../helpers/MyMongoose").Types;
const Log = require("./Log");
const validate = require("../helpers/Validator");
const Category = require("./Category");
const File = require("./File");

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
  sold: {
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

Product.methods.getList = async (providerId, categoryId = [], name, isShow, from, page, sort, ids) => {
  // console.log(providerId, categoryId, name, isShow, from, page, sort, ids);
  query = validate.validateRemove({ providerId, name, isShow }, [undefined]);
  if (providerId) providerId = mongoose.Types.ObjectId(providerId);
  if (providerId) query.providerId = providerId;

  if (name) query.name = new RegExp(`${name}`);
  if (Array.isArray(ids) && ids.length > 0) {
    ids = ids.map(e => mongoose.Types.ObjectId(e.toString()));
    query._id = { $in: ids };
  }
  // Dieu kien tim kiếm theo category
  console.log(categoryId);
  if (categoryId.length > 0) {
    let arr = await Category.find({ parentId: { $in: categoryId } });
    arr = arr.map(e => mongoose.Types.ObjectId(e._id.toString()));
    categoryId.map(e => mongoose.Types.ObjectId(e.toString()));
    arr = [...arr, ...categoryId];
    query.categoryId = {
      $in: arr
    };
  }
  from = Number(from) || 0;
  page = Number(page) || 9999;

  console.log("query ", query);
  let list = await Product.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "providerId",
        foreignField: "_id",
        as: "provider"
      }
    },
    {
      $lookup: {
        from: "files",
        localField: "_id",
        foreignField: "subOwner",
        as: "images"
      }
    },
    { $skip: from },
    { $limit: page },
    // { $sort: sort }
  ]);

  list.map(e => {
    e.category = e.category[0] ? e.category[0].name : "";
    e.provider = e.provider[0] ? e.provider[0].info : {};
    e.images = e.images.map(x => x.filename);
    return e;
  });
  return list;
};

Product.methods.getListByName = name => {
  if (name) return Product.find({ name: new RegExp(`/${name}/`) });
  else return Product.find();
};

async function reduceQuantity(ids, values) {
  return Promise.all(ids.map((id, index) => Product.updateOne({ _id: id }, { $inc: { quantity: -values[index] } })));
}

async function getDetail(id, provider = undefined, isShow = true) {
  let query = validate.validateRemove({ _id: id, isShow, providerId: provider }, [undefined]);
  let product = await Product.findOne(query)
    .populate("providerId")
    .populate("categoryId")
    .lean();
  let images = await File.find({ subOwner: { $all: [product._id] } });
  images = images.map(img => img.filename);
  console.log(images);
  product.images = images || [];
  return product;
}

function updateProduct(id, providerId, newProduct) {
  if (newProduct.ordered) delete newProduct.ordered;
  if (newProduct.created) delete newProduct.created;
  console.log(newProduct, id, providerId.toString());
  let query = { _id: id, providerId: providerId.toString() };
  Log.methods.addLog("Update Product", JSON.stringify(newProduct), "update");
  return Product.updateOne(query, newProduct);
}

function addProduct(data) {
  if (data.sold) delete data.sold;
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
