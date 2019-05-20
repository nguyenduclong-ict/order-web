const express = require("express");
var router = express.Router();
var Product = require("../../models/Product");
const File = require("../../models/File");
// Lay thong tin chi tiet cua 1 san pham
router.get("/detail/:id", getProductDetail);
router.get("/list", getList);
router.post("/add", postAddProduct);
router.post("/edit/:id", postEdit);

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
  Product.methods.addProduct(data)
    .then(doc => {
      return res.status(200).json({
        message: "Add Product success",
        data: doc
      });
    })
    .catch(err => {
      return res.json({
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
    .then(doc => {
      return res.status(200).json({
        message: "Update Product success",
        data: doc
      });
    })
    .catch(err => {
      return res.json({
        error: true,
        message: err.message
      });
    });
}

module.exports = router;
