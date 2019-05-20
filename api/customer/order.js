/*
 * @Author: Long Nguyễn
 * @Date: 2019-04-09 10:16:37
 * @Last Modified by: Long Nguyễn
 * @Last Modified time: 2019-04-21 15:56:58
 */

const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");
const OrderDetail = require("../../models/OrderDetail");
const Cart = require("../../models/Cart");

// Setup router
router.get("/list", getListOrder);
router.post("/add", postAddOrder);
router.post("/cancel-order", postCancelOrder);
router.post("/add-to-cart", postAddToCart);
router.post("/success-order", postSuccessOrder);
router.post("/change-product-count", postChangeOrderQuantity);

/**
 * Body : orderId, userId, quantity
 */
async function postChangeOrderQuantity(req, res) {
  let orderDetailId = req.body.orderDetailId;
  let userId = req.user._id;
  let quantity = req.body.quantity;
  OrderDetail.methods
    .changeProductQuantity(orderDetailId, quantity, userId)
    .then(() => {
      return res.json({ ok: 1, message: "thanh cong" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ ok: 0, message: "that bai" });
    });
}

/**
 * Body : orderId, comment, paymentId, quantity
 */

/** Quy trinh
 * 1 Lấy thông tin trong giở hàng
 * 2 Kiểm tra sản phẩm có thể mua không và số lượng đặt mua có hợp lệ không
 * 3 Kiểm tra phương thức thanh toán có hợp lệ không
 * 4 Tạo đơn đặt hàng mới
 * 5 Xoá đơn hàng khỏi giỏ hàng
 */
async function postAddOrder(req, res) {
  let userId = req.user._id;
  let { products, paymentId, discountIds } = req.body;

  Order.methods
    .addOrder(products, providerId, userId, paymentId, discountIds)
    .then(() => {
      return res.json({ ok: 1, message: "thanh cong" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ ok: 0, message: "that bai" });
    });
}

/**
 * Get list Order by user
 */
async function getListOrder(req, res) {
  let userId = req.user._id;
  Order.methods
    .getList(undefined, undefined, userId, undefined)
    .then(list => {
      return res.json(list);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ ok: 0, message: "fail" });
    });
}

// Huy don dat hang
/**
 * Body " orderid"
 * @param {*} req
 * @param {*} res
 */
async function postCancelOrder(req, res) {
  let userId = req.user._id;
  let { orderId, comment } = req.body;
  Order.methods
    .refuseOrderForUser(orderId, userId, comment)
    .then(() => {
      return res.json({ ok: 1, message: "Huy thanh cong" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ ok: 0, message: "that bai" });
    });
}

// Xac nhan nhan hang thanh cong!
/**
 * Body : orderId, comment
 */
async function postSuccessOrder(req, res) {
  let orderId = req.body.orderId;
  let comment = req.body.comment;
  let userId = req.user._id;
  Order.methods
    .successOrder(orderId, userId, undefined, comment)
    .then(() => {
      return res.json({ ok: 1, message: "Thanh cong" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ ok: 0, message: "that bai" });
    });
}

async function postAddToCart(req, res) {
  let userId = req.user._id;
  let { productId, quantity } = req.body;
  Cart.methods
    .addToCart(userId, undefined, productId, quantity)
    .then(() => {
      return res.json({ ok: 1, message: "thanh cong" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ ok: 0, message: "that bai" });
    });
}

module.exports = router;
