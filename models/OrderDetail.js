const mongoose = require("../helpers/MyMongoose").mongoose;
var Types = require("../helpers/MyMongoose").Types;
const bcrypt = require("bcrypt");
const Cart = require('./Cart');

var Schema = mongoose.Schema;
var schema = new Schema({
  productId: {
    // Link đến sản phẩm
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  product: {
    // Dữ liệu của sản phẩm tại thời điểm đặt hàng
    name: String,
    description: String,
    price: Number, // Gia san pham
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  discountId: mongoose.Schema.Types.ObjectId,
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
  }
});

var OrderDetail = mongoose.model("OrderDetail", schema);
OrderDetail.methods = {};

/**
 * 
 * @param {Mã khách hàng} customerId
 * @param {Mã của sản phẩm trong giỏ hàng} oicId 
 * @param {Mã của phương thức thanh toán} paymentId 
 * @param {Lưu ý cho người bán} commnet 
 * @param {Mã giảm giá} discountId
 */
async function addOrderDetail(customerId, oicId, paymentId, commnet, discount) {
    let oic = await Cart.methods.getOrderDetailInCart(customerId, undefined, oicId);

}

// export module
module.exports = OrderDetail;
