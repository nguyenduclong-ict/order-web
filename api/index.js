/*
 * @Author: Long Nguyễn 
 * @Date: 2019-04-08 22:37:11 
 * @Last Modified by: Long Nguyễn
 * @Last Modified time: 2019-04-21 17:27:10
 * 
 */

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/product/list/:from-:page-:sortField-:sort', getListProductPage);

async function getListProductPage(req, res) {
    let from = Number(req.parmas.from);
    let page = Number(req.parmas.page);
    let sortField = req.parmas.sortField;
    let s = req.parmas.sort;
    let sort = {};
    sort[sortField] = s;
    try {
        let list = await Product.find()
        .sort(sort)
        .skip(from)
        .limit(page)

        res.json(list);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Lỗi');
    };
    
}



module.exports = router;
