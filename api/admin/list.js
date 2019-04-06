const express = require('express');
var router = express.Router();
var Product = require('../../models/Product');
const User = require('../../models/User');
// Lay danh sach nha cung cap
router.get('/provider/:from-:page', (req, res) => {
    let from = req.params.from;
    let page = req.params.page;
    let query = {};

    User.find(query, { skip : from, limit : page } , (err, docs) => {
        res.status(200).json(docs);
    })
});

// Lay danh sach san pham
router.get('/product/:from-:page-:providerid', (req, res) => {
    let from = req.params.from;
    let page = req.params.page;
    let provider_id = req.params.providerid;

    let query = {};
    if(provider_id !== 'all' && provider_id) query.provider_id = provider_id;
    // Query database
    Product.find(query, { skip : from, limit : page } , (err, docs) => {
        res.status(200).json(docs);
    })
});

module.exports = router;