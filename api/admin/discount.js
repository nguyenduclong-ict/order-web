// router path : /api/Discount
const express = require("express");
var router = express.Router();
var Discount = require("../../models/Discount");
var Product = require("../../models/Product");
const validator = require("../../helpers/Validator");

// Router
router.get("/list/:from-:page-:product-:provider-:search", getList);
router.get("/detail/:id", getDetail);
router.get("/products/:name", getListProducts);
router.post("/add", postAdd);
router.post("/edit/:id", postEdit);
router.post("/change-status", postChangeStatus);

function getListProducts(req, res) {
  let name = req.params.name;
  name = name === "all" ? undefined : name.split("%20").join(" ");

  Product.methods
    .getListByName(name)
    .then(result => {
      return res.json(result);
    })
    .catch(err => {
      console.log(err);
      return res.json([]);
    });
}

// Change status multiplite
function postChangeStatus(req, res) {
  let { ids, status } = req.body;
  Discount.methods
    .changeStatus(ids, status)
    .then(result => {
      return res.json({ ok: 1 });
    })
    .catch(err => {
      return res.json({ ok: 0, message: err.message });
    });
}

// Danh sach loc - cac tham so productid , categoryid de 'all' de lay ra tat ca
function getList(req, res) {
  let { from, page, search } = req.params;

  product = req.params.product !== "all" ? req.params.product : undefined;
  provider = req.params.provider !== "all" ? req.params.provider : undefined;

  if (search !== "all") {
    search = search.replace("%20", " ");
    Discount.methods
      .getListByName(from, page, search)
      .then(list => {
        return res.json(list);
      })
      .catch(err => {
        console.log(err);
        return res.json([])
      })
  } else {
    Discount.methods
      .getList(from, page, product, provider)
      .then(result => {
        console.log(result);
        return res.json(result);
      })
      .catch(err => {
        return res.json([]);
      });
  }
}

function getDetail(req, res) {
  console.log("get Discount by id : " + req.params.id);
  let id = req.params.id;
  Discount.methods
    .getDetail(id)
    .then(result => {
      return res.json(result);
    })
    .catch(err => {
      return res.json({
        error: "Discount khong ton tai"
      });
    });
}

// Add Discount
function postAdd(req, res) {
  let data = req.body;
  data.status = true;
  Discount.methods
    .addDiscount(
      data.startDate,
      data.endDate,
      data.status,
      data.value,
      data.products
    )
    .then(result => {
      return res.json({ ok: 1 });
    })
    .catch(err => {
      console.log(err);
      return res.json({ ok: 0 });
    });
}

// Edit Discount
function postEdit(req, res) {
  let data = req.body;
  data._id = req.params.id;
  console.log(data);
  Discount.methods
    .editDiscount(data)
    .then(result => {
      return res.json({ ok: 1 });
    })
    .catch(err => {
      console.log(err);
      return res.json({ ok: 0 });
    });
}
module.exports = router;
