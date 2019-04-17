// router path : /api/Payment
const express = require('express');
var router = express.Router();
var Payment = require('../../models/Payment');

router.get('/list/:from-:page', (req, res) => {
    let from = Number(req.params.from);
    let page = Number(req.params.page);
    Payment.find()
        .skip(from)
        .limit(page)
        .lean()
        .then(docs => {
            return res.json(docs);
        })
});

router.get('/detail/:id', (req, res) => {
    console.log('get Payment by id : ' + req.params.id);
    let PaymentId = req.params.id;
    Payment.findOne({
        _id: PaymentId
    }, (err, docs) => {
        if (docs)
            res.json(docs);
        else res.json({
            error: "Payment khong ton tai"
        })
    })
});

// Add Payment
router.post('/add', (req, res) => {
    let data = req.body;
    console.log(data);
    let newPayment = new Payment(data);
    newPayment.save()
        .then((doc) => {
            return res.json({message : "Add Payment success", data : doc})
        })
        .catch((err) => {
            return res.json({error : true , message : err.message})            
        })
})

// Edit Payment
router.post('/edit/:id', (req, res) => {
    let query = {_id : req.params.id};
    let data = req.body;
    console.log(data);
    
    Payment.updateOne(query, data, (err) => {
        if(err) {
            console.log(err);
            return res.json({error : "Xay ra loi", message : err.message});
        } else {
            console.log('Update Payment ' + req.params.id + 'success!');
            return res.json({message : 'update success!'});
        }
    });
})
module.exports = router;