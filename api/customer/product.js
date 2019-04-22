
const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
//
router.get('/list/:from-:page-:category-:provider', getListProduct);

async function getListProduct(req, res) {
    let {from , page, category, provider} = req.params;
    console.log(from, page, category);
    
    Product.methods.getList(provider, category, from, page)
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