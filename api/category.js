// router path : /api/Category
const express = require("express");
var router = express.Router();
var Category = require("../models/Category");

router.get("/list", getList);

async function getList(req, res) {
  let { parent, from, page } = req.query;
  Category.methods
    .getList(parent,from,page)
    .then(list => {
      return res.json(list);
    })
    .catch(e => {
      console.log(e);
      return res.status(500).json({ message: "Lỗi" });
    });
}

module.exports = router;
