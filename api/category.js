// router path : /api/Category
const express = require('express');
var router = express.Router();
var Category = require('../../models/Category');

router.get('/list/:from-:page-:root', (req, res) => {
    let root = req.params.root;
    let from = req.params.from;
    let page = req.params.page;
    let query = {};
    query.root = root ? root : undefined;
    Category.find(query, {skip : from, limit : page}, (err, docs) => {
        res.staus(200).json(docs);
    })
});



module.exports = router;