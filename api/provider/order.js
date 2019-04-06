const express = require('express');
var router = express.Router();
var Order = require('../../models/Order');

// lay danh sach don hang
router.get('/list/:from-:page:-productid', (req, res) => {
    let provider_id = req.user.provider._id;
    let from = req.params.from;
    let page = req.params.page;
    let productid = req.params.productid;

    let query = {};
    query.provider_id = provider_id;
    if (productid !== 'all' && productid) query.product_id = productid;
    query.provider_id = provider_id;

    Order.find(query, {
        skip: from,
        limit: page
    }, (err, docs) => {
        res.status(200).json(docs);
    })
})

// Lay thong tin chi tiet cua 1 don hang
router.get('/detail/:id', (req, res) => {
    console.log('get order by id : ' + req.params.id);
    let id = req.params.id;
    let provider_id = req.user._id;

    Order.findOne({
        _id: id,
        provider_id: provider_id
    }, (err, docs) => {
        if (docs)
            return res.status(200).json(docs);
        else return res.json({
            error: "Order không tồn tại"
        })
    })
});


// Edit Order
// body data :
// body = {
//     comment : "comment here"
// }
router.post('/edit-comment/:id', async (req, res) => {
    let provider_id = req.user._id;
    Order.findOneAndUpdate({
        _id: req.params.id,
        provider_id: provider_id
    }, {
        $set: {
            "status.0.comment": req.body.comment
        }
    }, {
        sort: {
            "status": 1
        }
    }, (err) => {
        if (err) {
            console.log(err);
            return res.json({
                error: "Xay ra loi",
                message: err.message
            });
        } else {
            console.log('Update Order ' + req.params.id + 'success!');
            return res.json({
                message: 'Update success!'
            });
        };
    });
})

// Nhan don hang
router.post('/nhan-don/:id', (req, res) => {
    let orderId = req.params.id;
    let provider_id = req.user._id;
    // Lúc này đơn hàng đang trong thời gian chờ duyệt
    // Tìm kiếm số lượng sản phẩm có đủ để nhận đơn không 

    // Nếu đủ số lượng hàng để nhận đơn
    let status = {
        code: 1,
        commnet: req.body.comment,
        time: Date.now()
    };
    Order.findOneAndUpdate({
            _id: orderId,
            provider_id: provider_id,
            "status.0.code": 0
        }, {
            $push: {
                status: status
            }
        }, {
            sort: {
                status: 1
            }
        },
        (err) => {
            if (err) {
                console.log(err);
                return res.json({
                    error: "Xay ra loi",
                    message: err.message
                });
            } else {
                console.log('Update Order ' + req.params.id + 'success!');
                return res.json({
                    message: 'Nhận đơn hàng thành công!'
                });
            };
        });
});

router.post('/giao-hang/:id', (req, res) => {
    let orderId = req.params.id;
    let provider_id = req.user._id;
    // Lúc này đơn hàng đang trong thời gian chờ duyệt
    // Tìm kiếm số lượng sản phẩm có đủ để nhận đơn không 

    // Nếu đủ số lượng hàng để nhận đơn
    let status = {
        code: 2,
        commnet: req.body.comment,
        time: Date.now()
    };
    Order.findOneAndUpdate({
        _id: orderId,
        provider_id: provider_id,
        "status.0.code": 0
    }, {
        $push: {
            status: status
        }
    }, {
        sort: {
            status: 1
        }
    }, (err) => {
        if (err) {
            console.log(err);
            return res.json({
                error: "Xay ra loi",
                message: err.message
            });
        } else {
            console.log('Update Order ' + req.params.id + 'success!');
            return res.json({
                message: 'Nhận đơn hàng thành công!'
            });
        };
    });
})
module.exports = router;