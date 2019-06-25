// router path : /api/Category
const express = require("express");
var router = express.Router();
var Category = require("../../models/Category");
var File = require("../../models/File");

router.get("/list/:parentId-:from-:page", getList);
router.get("/list", getAll);
router.get("/detail/:id", getDetail);
router.post("/add", postAddCategory);
router.post("/edit/:id", postEditCategory);
router.post("/set-show", postSetShow);

function postSetShow(req, res) {
  let { ids, isShow } = req.body;
  Category.methods.setShow(ids, isShow).then(result => {
    return res.json({ ok: 1, isShow: isShow });
  });
}

async function getAll(req, res, next) {
  let { parentId, from, page } = req.query;
  Category.methods
    .getList(parentId, from, page)
    .then(docs => {
      console.log(docs);
      res.json(docs);
    })
    .catch(error => next(error));
}

async function getList(req, res) {
  let parentId = req.params.parentId == "root" ? undefined : req.params.parentId;
  let from = Number(req.params.from);
  let page = Number(req.params.page);
  Category.methods
    .getList(parentId, from, page)
    .then(result => {
      return res.json(result);
    })
    .catch(error => {
      return res.status(500).json({ message: "Lỗi" });
    });
}

function getDetail(req, res) {
  console.log("get Category by id : " + req.params.id);
  let CategoryId = req.params.id;
  Category.findOne(
    {
      _id: CategoryId
    },
    (err, docs) => {
      if (docs) res.json(docs);
      else
        res.json({
          error: "Category khong ton tai"
        });
    }
  );
}

// Add Category
async function postAddCategory(req, res, next) {
  let name = req.body.name;
  let parentId = req.body.parentId;
  Category.methods
    .add(name, parentId)
    .then(doc => {
      return res.json({
        ok: 1,
        message: "Add category success",
        data: doc
      });
    })
    .catch(error => {
      return next(error);
    });
}

// Edit Category
function postEditCategory(req, res, next) {
  let categoryId = req.params.id;
  let { name, parentId, isShow } = req.body;

  console.log(req.body);
  Category.methods
    .edit({categoryId, name, parentId, isShow})
    .then(result => {
      console.log(result);
      return res.json({
        ok: 1,
        message: "Update Success!"
      });
    })
    .catch(error => {
      return next(error);
    });
}

module.exports = router;
