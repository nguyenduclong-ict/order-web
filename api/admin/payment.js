// router path : /api/Payment
const express = require('express');
var router = express.Router();
var Payment = require('../../models/Payment');

router.get('/list/:from-:page', getList);
router.get('/detail/:id', getDetail);
router.post('/edit/:id', postEdit);
router.post('/add', postAdd);
router.post('/change-display', postChangeDisplay);


function postChangeDisplay(req, res) {
    let {ids, isShow} = req.body;

    Payment.updateMany({_id : {$in : ids}}, {isShow : isShow}) 
        .then(result => {
            return res.json({ok : 1, message : "Thành công"});
        })

}

function getList(req, res) {
    let from = Number(req.params.from);
    let page = Number(req.params.page);
    Payment.find()
        .skip(from)
        .limit(page)
        .lean()
        .then(docs => {
            return res.json(docs);
        })
};


function getDetail (req, res)  {
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
};

// Add Payment
function postAdd (req, res)  {
    let data = req.body;
    console.log(data);
    data.isShow = true;
    let newPayment = new Payment(data);
    newPayment.save()
        .then((doc) => {
            return res.json({ok : 1, message : "Thêm thành công", data : doc})
        })
        .catch((err) => {
            return res.json({ok : 0 , message : err.message})            
        })
};

// Edit Payment
function postEdit (req, res)  {
    let query = {_id : req.params.id};
    let data = req.body;
    console.log(data);
    
    Payment.updateOne(query, data, (err) => {
        if(err) {
            console.log(err);
            return res.json({ok : 0, message : "Xảy ra lỗi", message2 : err.message});
        } else {
            return res.json({ ok : 1, message : 'Cập nhật thành công!'});
        }
    });
};

module.exports = router;