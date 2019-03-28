const express = require('express');
var router = express.Router();
var Order = require('../../models/Order');

// lay danh sach don hang
router.get('/list/:from-:page:-productid', (req, res) => {
    let provider_id = req.session.user._id;
    let from = req.params.from;
    let page = req.params.page;
    let productid = req.params.productid;

    let query = {};
    query.provider_id = provider_id;
    if(productid !== 'all' && productid) query.product_id;
    Order.find(query, { skip : from, limit : page } , (err, docs) => {
        res.status(200).json(docs);
    })
})

// Lay thong tin chi tiet cua 1 don hang
router.get('/detail/:id', (req, res) => {
    console.log('get order by id : ' + req.params.id);
    let id = req.params.id;
    Order.findOne({_id: id}, (err, docs) => {
        if (docs)
            return res.status(200).json(docs);
        else return res.json({
            error: "Order khong ton tai"
        })
    })
});


// Edit Order
router.post('/edit/:id', (req, res) => {
    let query = {_id : req.params.id};
    let data = req.body;
    delete data['provider_id'];
    console.log('Edit Order' , data);
    
    User.updateOne(query, data, (err) => {
        if(err) {
            console.log(err);
            return res.json({error : "Xay ra loi", message : err.message});
        } else {
            console.log('Update Order ' + req.params.id + 'success!');
            return res.json({message : 'Update success!'});
        }
    });
})



module.exports = router;