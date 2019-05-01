const mongoose = require("../helpers/MyMongoose").mongoose;
var Schema = mongoose.Schema;

var schema = new Schema({
  orderDetails: [{type : Schema.Types.ObjectId, ref : 'OrderDetail'}],
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
  paymentId: {type : Schema.Types.ObjectId, ref : 'Payment'},
  customerId: {type : Schema.Types.ObjectId, ref : 'User'},
  created: Date
});

var Order = mongoose.model("Order", schema);
Order.methods = {};

module.exports = Order;
