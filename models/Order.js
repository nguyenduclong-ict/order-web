const mongoose = require("../helpers/MyMongoose").mongoose;
var Schema = mongoose.Schema;

var schema = new Schema({
  orderDetails: [mongoose.Schema.Types.ObjectId],
  totalPay: Number,
  status: [
    {
      code: {
        // 0 : Chờ xác nhận,  1 : Đã xác nhận, 2 : Đang giao , 3 : Hoàn thành, 4 : Bị huỷ
        type: Number,
        enum: [0, 1, 2, 3, 4],
        default: 0
      },
      comment: String,
      time: {
        type: Date,
        default: Date.now()
      }
    }
  ],

  paymentId: mongoose.Schema.Types.ObjectId,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  created: Date
});

var Order = mongoose.model("Order", schema);
Order.methods = {};

module.exports = Order;
