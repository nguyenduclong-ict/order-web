const mongoose = require("../helpers/MyMongoose").mongoose;
var Schema = mongoose.Schema;
const validator = require("../helpers/Validator");
const Product = require("./Product");
const OrderDetail = require("./OrderDetail");

const orderStatus = {
  pending: 0,
  accepted: 1,
  delivery: 2,
  success: 3,
  fail: 4
};

var schema = new Schema({
  orderDetails: [{ type: Schema.Types.ObjectId, ref: "OrderDetail" }],
  totalPay: Number,
  preStatus: [
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
  status: { type: Number, default: 0 },
  success: {
    type: Number,
    default: 0
  },
  comment: { type: String, default: 0 },
  paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
  customerId: { type: Schema.Types.ObjectId, ref: "User" },
  providerId: { type: Schema.Types.ObjectId, ref: "User" },
  created: { type: Date, default: Date.now() }
});

//
schema.pre("updateOne", () => {
  console.log(this);
});

var Order = {};
Order = mongoose.model("Order", schema);
Order.methods = {};

/**
 * Lay danh sach order
 * @param {*} productId
 * @param {*} providerId
 * @param {*} customerId
 * @param {*} from
 * @param {*} page
 * @param {*} sort
 */
function getList(
  productId,
  providerId,
  customerId,
  status,
  from = -1,
  page = -1,
  sort = 1
) {
  let query = validator.validateRemove(
    { productId, customerId, providerId, status },
    [undefined]
  );

  let result = Order.find(query);
  if (from) result.skip(Number(from));
  if (page) result.limit(Number(page));
  if (sort) result.sort({ created: sort });
  result.populate("orderDetails");
  result.populate("customerId");
  result.populate("providerId");
  return result.exec();
}

function getDetail(id, providerId) {
  let query = validator.validateRemove({ _id: id, providerId }, [undefined]);
  return Order.find(query);
}

function editComment(id, providerId, comment) {
  let select = {
    _id: id,
    providerId: providerId
  };
  let updater = {
    comment: comment,
    "status.0.comment": comment
  };

  return Order.updateOne(select, updater).exec();
}

async function changeOrderStatus(id, newStatus, comment) {
  try {
    return Order.updateOne(
      { _id: id },
      {
        $push: {
          $each: [
            {
              code: newStatus,
              comment: comment,
              time: Date.now()
            }
          ],
          $sort: { time: -1 }
        }
      }
    );
  } catch {
    return Promise.reject();
  }
}

/**
 * Nha cung cap chap nhan don hang
 * @param {*} id
 * @param {*} providerId
 * @param {*} comment
 */
async function acceptOrder(id, providerId, comment) {
  let order = await Order.findOne({
    _id: id,
    productId: productId,
    status: orderStatus.pending
  });
  if (!order) throw new Error("Order Khong hop le");
  return changeOrderStatus(id, 1, comment);
}

/**
 * Huy don hang tu phia nha cung cap
 * @param {*} id
 * @param {*} providerid
 * @param {*} comment
 */
async function refuseOrder(id, providerId, comment) {
  let order = await Order.findOne({ _id: id, providerId });
  if (!order) throw new Error("Order Khong hop le");
  return changeOrderStatus(id, orderStatus.fail, comment);
}

/**
 * Huy don hang cho khach hang
 * @param {*} id
 * @param {*} customerId
 * @param {*} comment
 */
async function refuseOrderForUser(id, customerId, comment) {
  let order = await Order.findOne({
    _id: id,
    customerId: customerId,
    status: orderStatus.pending
  });
  if (!order) throw new Error("Order Khong hop le");
  return changeOrderStatus(id, orderStatus.fail, comment);
}

/**
 * 
 * @param {*} id 
 * @param {*} customerId 
 * @param {*} comment 
 */
async function deliveryOder(id, providerId, comment) {
  let order = await Order.findOne({
    _id: id,
    providerId,
    status: orderStatus.accepted
  });
  if (!order) throw new Error("Order Khong hop le");
  return changeOrderStatus(id, orderStatus.delivery, comment);
}

async function successOrder(id, customerId, providerId, comment) {
  let query = validator.validateRemove(
    { _id: id, customerId, providerId, status: orderStatus.delivery },
    [undefined]
  );
  Order.findOneAndUpdate(query, {
    comment: comment,
    $inc: {
      success: 1
    }
  }).then(async doc => {
    console.log(doc);
    if (doc.success == 2) {
      let order = await Order.findOne({ _id: id }).populate("orderDetails");

      let ids = order.orderDetails.map(e => e.productId);
      let quantitys = order.orderDetails.map(e => e.quantity);
      // Update status order and Product quantity
      let p1 = changeOrderStatus(id, orderStatus.success, "");
      return Promise.all([p1, Product.methods.reduceQuantity(ids, quantitys)]);
    } else return Promise.resolve();
  });
}

async function addOrder(
  products,
  providerId,
  customerId,
  paymentId,
  discountIds
) {
  let arr = await Product.find({
    _id: { $in: products.map(e => e.productId) },
    providerId
  });

  if (arr.length < products.length)
    throw new Error("San pham trong don hang khong hop le");
  arr.forEach((e, i) => {
    if (e.quantity < products[i].quantity)
      throw new Error("San pham trong don hang khong hop le");
  });

  // Them Order
  let orderDetails = [];
  products.forEach(e => {
    orderDetails.push(
      OrderDetail.methods.addOrderDetail(customerId, e, paymentId, discountIds)
    );
  });

  return Promise.all(orderDetails).then(list => {
    let odIds = list.map(e => e._id);
    let totalPay = 0;
    list.map(e => totalPay += e.total);
    let order = {
      orderDetails : odIds, 
      preStatus : [],
      totalPay : totalPay,
      customerId,
      providerId
    }
    order.save()
  })
}

// Map Function
Order.methods.getList = getList;
Order.methods.getDetail = getDetail;
Order.methods.editComment = editComment;
Order.methods.acceptOrder = acceptOrder;
Order.methods.successOrder = successOrder;
Order.methods.refuseOrder = refuseOrder;
Order.methods.refuseOrderForUser = refuseOrderForUser;
Order.methods.addOrder = addOrder;
Order.methods.deliveryOder = deliveryOder;

module.exports = Order;
