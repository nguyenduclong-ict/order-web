// router path : /api/Category
const express = require('express');
var router = express.Router();
var Category = require('../models/Category');

router.get('/list/:from-:page-:parent', getListCategory);


async function getListCategory(req, res) {
    let {from , page } = req.params;
    let parentId = req.params.parent;
    Category.methods.getList(parentId,from,page)
    .then(result => {
        return res.json(result);
    })
    .catch(error => {
        return res.status(500).json({message : 'Lỗi'});
    });
};


module.exports = router;