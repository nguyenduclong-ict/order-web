const express = require("express");
var router = express.Router();
var Product = require("../../models/Product");
const File = require("../../models/File");
// Lay thong tin chi tiet cua 1 san pham
router.get("/detail/:id", getProductDetail);
router.get("/list", getList);
router.post("/add", postAddProduct);
router.post("/edit/:id", postEdit);
router.post("/show", setIsShow);

function setIsShow(req, res) {
  try {
    let { ids, isShow } = req.body;
    let providerId = req.user._id;
    console.log(ids, isShow);
    Product.updateMany({ _id: { $in: ids }, providerId }, { isShow }).then(result => {
      let ok = 0;
      if (result.nModified === ids.length) ok = 1;
      return res.json({ result: result, ok: ok, message: ok === 1 ? "Thanh cong" : "That bai" });
    });
  } catch (error) {}
}

function getList(req, res) {
  let { from, page, category, name } = req.query;
  let provider = req.user._id;

  Product.methods
    .getList(provider, category, name, undefined, from, page)
    .then(list => {
      console.log(list);
      return res.json(list);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).send(error.message);
    });
}

async function getProductDetail(req, res) {
  let id = req.query.id;
  provider = req.user._id;
  Product.methods
    .getDetail(id, provider)
    .then(data => {
      console.log(data);
      return res.json(data);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).send(error.message);
    });
}

// Add Product

function postAddProduct(req, res) {
  let data = req.body;
  data.providerId = req.user._id;
  Product.methods
    .addProduct(data)
    .then(doc => {
      return res.status(200).json({
        ok : 1,
        message: "Add Product success",
        data: doc
      });
    })
    .catch(err => {
      return res.json({
        ok :0,
        error: true,
        message: err.message
      });
    });
}

// Edit Product

function postEdit(req, res) {
  let data = req.body;
  let providerId = req.user._id;
  let id = req.params.id;
  Product.methods
    .updateProduct(id, providerId, data)
    .then(rs => {
      if (rs.ok === 1 && rs.nModified > 0)
        return res.status(200).json({
          message: "Update Product success",
          ok: 1
        });
      else throw new Error("Update Fail, ban khong co quyen chinh sua san pham nay");
    })
    .catch(err => {
      return res.json({
        error: true,
        message: err.message
      });
    });
}

module.exports = router;
