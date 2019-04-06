const express = require('express');
var router = express.Router();
var Product = require('../../models/Product');

router.get('/list/:from-:page', (req, res) => {
    let from = req.params.from;
    let page = req.params.page;
    let provider_id = req.session.Product._id;
    Product.find({ provider_id: provider_id }, { skip: from, limit: page }, (err, docs) => {
        res.status(200).json(docs);
    })
});

// Lay thong tin chi tiet cua 1 san pham
router.get('/detail/:id', (req, res) => {
    console.log('get Product by id : ' + req.params.id);
    let id = req.params.id;
    let provider_id = req.user._id;
    Product.findOne({ _id: id }, (err, docs) => {
        if (docs)
            return res.status(200).json(docs);
        else return res.json({
            error: "Product khong ton tai"
        })
    })
});

// Add Product
router.post('/add', (req, res) => {
    let data = req.body;
    data.provider_id = req.user._id;
    data.provider_id = provider_id;
    console.log(data);
    let product = new Product(data);
    product.save()
        .then((doc) => {
            return res.status(200).json({ message: "Add Product success", data: doc })
        })
        .catch((err) => {
            return res.json({ error: true, message: err.message })
        })
});


// Edit Product
router.post('/edit/:id', (req, res) => {
    let data = req.body;
    let provider_id = req.user._id;
    let query = { _id: req.params.id, provider_id: provider_id };
    delete data['provider_id'];
    console.log('Edit Product', data);

    Product.updateOne(query, data, (err) => {
        if (err) {
            console.log(err);
            return res.json({ error: "Xay ra loi", message: err.message });
        } else {
            console.log('Update Product ' + req.params.id + 'success!');
            return res.json({ message: 'Update success!' });
        }
    });
})



module.exports = router;