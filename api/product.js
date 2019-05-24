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
  let { from, page, category, provider, name, sort, ids} = req.query;
  console.log( from, page, category, provider, name, sort, ids);
  
  // console.log(ids);
  if (ids) ids = ids.split("|");
  else ids = [];
  // console.log(ids);
  Product.methods
    .getList(provider, category, name, true, from, page, sort, ids)
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
  let id = req.params.id;
  console.log(id);
  Product.methods
    .getDetail(id)
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
