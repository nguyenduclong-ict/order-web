/*
 * @Author: Long Nguyễn 
 * @Date: 2019-04-08 22:37:11 
 * @Last Modified by: Long Nguyễn
 * @Last Modified time: 2019-04-09 10:07:56
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
    let sort = req.parmas.sort;
    try {

        let list = await Product.find()
        .sort({sortField : sort})
        .skip(from)
        .limit(page)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Lỗi');
    };
    
}



module.exports = router;
