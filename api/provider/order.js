const express = require("express");
var router = express.Router();
var Order = require("../../models/Order");

// lay danh sach don hang
router.get("/list", getListOrder);
router.post("/edit-comment/:id", postEditComment);
router.get("/detail/:id", getDetail);
router.post("/nhan-don/:id", aceptOrder);
router.post("/giao-hang/:id", postGiaoHang);

async function getListOrder(req, res) {
  let { from, page, customerId, providerId } = req.query;
  let providerId = req.user._id;
  Order.methods
    .getList(productId, providerId, customerId, from, page)
    .then(list => {
      return res.status(200).json(list);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).send("Get list Error");
    });
}

// Lay thong tin chi tiet cua 1 don hang

async function getDetail(req, res) {
  console.log("get order by id : " + req.params.id);
  let id = req.params.id;
  let providerId = req.user._id;
  Order.methods
    .getDetail(id, providerId)
    .then(data => {
      console.log(data);
      return res.status(200).json(docs);
    })
    .catch(error => {
      console.log(error);
      return res.status(404).send("Order not exist!");
    });
}

// Edit Order comment
// body data :
// body = {
//     comment : "comment here"
// }
async function postEditComment(req, res) {
  let providerId = req.user._id;
  let id = req.params.id;
  let { comment } = req.body;
  Order.methods
    .EditComment(id, providerId, comment)
    .then(result => {
      console.log("Update Order ", result);
      return res.status(200).send("Update success");
    })
    .catch(error => {
      console.log(err);
      return res.status(500).send("Error");
    });
}

// Nhan don hang
async function aceptOrder(req, res) {
  let orderId = req.params.id;
  let providerId = req.user._id;
  let comment = req.body.comment;
  Order.methods
    .acceptOrder(orderId, providerId, comment)
    .then(() => {
      return res.json({ ok: 1, message: "thanh cong" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ ok: 0, message: "that bai" });
    });
}

async function postGiaoHang(req, res) {
  let orderId = req.params.id;
  let providerId = req.user._id;

  Order.methods
    .deliveryOder(orderId, providerId)
    .then(() => {
      return res.json({ ok: 1, message: "thanh cong" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({ ok: 0, message: "that bai" });
    });
}

module.exports = router;
