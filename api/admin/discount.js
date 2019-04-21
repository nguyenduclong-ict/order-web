// router path : /api/Discount
const express = require("express");
var router = express.Router();
var Discount = require("../../models/Discount");
const validator = require("../../helpers/Validator");

// Router
router.get("/list/:from-:page-:productid-:categoryid", getList);
router.get("/detail/:id", getDetail);
router.post("/add", postAdd);
router.post("/edit/:id", postEdit);

// Danh sach loc - cac tham so productid , categoryid de 'all' de lay ra tat ca
function getList(req, res) {
  let from = req.params.from;
  let page = req.params.page;
  let product_id = req.params.productid;
  let category_id = req.params.categoryid;

  // query
  let query = validator({ product_id, category_id }, ["all", undefined]);

  //
  Discount.find(query, { skip: from, limit: page }, (err, docs) => {
    res.staus(200).json(docs);
  });
}

function getDetail(req, res) {
  console.log("get Discount by id : " + req.params.id);
  let id = req.params.id;
  Discount.findOne(
    {
      _id: id
    },
    (err, docs) => {
      if (docs) res.json(docs);
      else
        res.json({
          error: "Discount khong ton tai"
        });
    }
    );
}

// Add Discount
function postAdd (req, res)  {
  let data = req.body;
  console.log(data);
  let discount = new Discount(data);
  discount.save()
    .then(doc => {
      return res.json({ message: "Add Discount success", data: doc });
    })
    .catch(err => {
      return res.json({ error: true, message: err.message });
    });
};

// Edit Discount
function postEdit (req, res) {
  let query = { _id: req.params.id };
  let data = req.body;
  console.log(data);

  Discount.updateOne(query, data, err => {
    if (err) {
      console.log(err);
      return res.json({ error: "Xay ra loi", message: err.message });
    } else {
      console.log("Update Discount " + req.params.id + "success!");
      return res.json({ message: "update success!" });
    }
  });
};
module.exports = router;
