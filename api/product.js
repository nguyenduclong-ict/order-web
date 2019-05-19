const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
//

/**
 * query : from, page, category, privovider
 */
router.get("/list", getListProduct);
router.get("/detail/:id", getDetail);

async function getListProduct(req, res) {
  let { from, page, category, provider, name, sortf, sortv } = req.query;

  Product.methods
    .getList(provider, category, name, true, from, page, sortf, sortv)
    .then(list => {
      console.log(list);
      return res.json(list);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).send(error.message);
    });
}

async function getDetail(req, res) {
  let id = req.query.id;
  Product.methods
    .getDetail(id, true)
    .then(data => {
      console.log(data);
      return res.json(data);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).send(error.message);
    });
}

module.exports = router;
