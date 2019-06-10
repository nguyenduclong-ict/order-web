const mongoose = require("../helpers/MyMongoose").mongoose;
const Discount = require("./Discount");
const Product = require('./Product')
var Schema = mongoose.Schema;
var schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  product: {
    // Dữ liệu của sản phẩm tại thời điểm đặt hàng
    name: String,
    description: String,
    price: Number // Gia san pham
  },
  discountId: { type: Schema.Types.ObjectId, ref: "Discount" },
  quantity: {
    // Số lượng đặt hàng
    type: Number,
    default: 1,
    required: true,
    validate: {
      validator: v => v > 0,
      message: props => `quantity must greater than 0!`
    }
  },
  total: {
    // Tổng thanh toán
    type: Number,
    default: 0,
    validate: {
      validator: v => v > 0,
      message: props => `total pay must greater than 0!`
    }
  },
  created: { type: Date, default: Date.now() }
});
var OrderDetail = {};
OrderDetail = mongoose.model("OrderDetail", schema);
OrderDetail.methods = {};

/**
 *
 * @param {Mã khách hàng} customerId
 * @param {Mã của sản phẩm trong giỏ hàng} oicId
 * @param {Mã của phương thức thanh toán} paymentId
 * @param {Lưu ý cho người bán} commnet
 * @param {Mã giảm giá} discountId
 */
async function  addOrderDetail(customerId, productId, discountId, quantity) {
  // Check discount, payment
  let pdis = 0; // Phan tram giam gia dinh nghia o day
  try {
    let f = await Discount.methods.checkDiscount(discountId, productId);
    if (f.ok) pdis = f.discount.value * 0.01;
  } catch {

  }
  let prod = await Product.findOne({ _id: productId });
  console.log(prod);
  let data = {
    customerId,
    productId: productId,
    quantity: quantity,
    product: {
      name: prod.name,
      description: prod.description,
      price: prod.price
    },
    total: quantity * prod.price * (1 - pdis) // tru di phan giam gia o day
  };
  if(discountId) data.discountid = discountId;
  console.log(data);
  let doc = new OrderDetail(data);
  return doc.save();
}

async function changeProductQuantity(id, quantity) {
  return OrderDetail.findOneAndUpdate({ _id: id }, { quantity: quantity });
}

OrderDetail.methods.addOrderDetail = addOrderDetail;
OrderDetail.methods.changeProductQuantity = changeProductQuantity;
// export module
module.exports = OrderDetail;
