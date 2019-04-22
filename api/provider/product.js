const express = require('express');
var router = express.Router();
var Product = require('../../models/Product');
const File =require("../../models/File");

router.get('/list/:from-:page', (req, res) => {
    let from = Number(req.params.from);
    let page = Number(req.params.page);
    Product.find({providerId : providerId})
        .skip(from)
        .limit(page)
        .then(list => {
            res.status(200).json(list);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send("Get list Fail");
        });
});

// Lay thong tin chi tiet cua 1 san pham
router.get('/detail/:id', getProductDetail);

async function getProductDetail(req, res) {
    try {

        let product = await Product.findOne({_id: req.params.id}).lean();
        console.log(product);
        let query =  {
            owner: req.user._id,
            subOwner :  product._id,
            type: 'image',
            of: 'product/images'
        }
        let images = await File.find(query).select(['filename', 'isPublic']).lean();
        product.images = images;
        return res.status(200).json(product);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error');
    }
};

// Add Product
router.post('/add', (req, res) => {
    let data = req.body;
    data.providerId = req.user._id;
    console.log(data);
    let product = new Product(data);
    product.save()
        .then((doc) => {
            return res.status(200).json({
                message: "Add Product success",
                data: doc
            })
        })
        .catch((err) => {
            return res.json({
                error: true,
                message: err.message
            })
        })
});


// Edit Product
router.post('/edit/:id', (req, res) => {
    let data = req.body;
    let providerId = req.user._id;
    let query = {
        _id: req.params.id,
        providerId: providerId
    };
    delete data.providerId;
    delete data._id;
    console.log('Edit Product', data);

    Product.updateOne(query, data, (err) => {
        if (err) {
            console.log(err);
            return res.json({
                error: "Xay ra loi",
                message: err.message
            });
        } else {
            console.log('Update Product ' + req.params.id + 'success!');
            return res.json({
                message: 'Update success!'
            });
        }
    });
})



module.exports = router;