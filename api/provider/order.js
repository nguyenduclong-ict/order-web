const express = require('express');
var router = express.Router();
var Order = require('../../models/Order');
const Product = require('../../models/Product');
const transaction = require('mongoose-transactions');

// lay danh sach don hang
router.get('/list/:from-:page:-productid', getListPage);

async function getListPage(req, res) {

    let providerId = req.user._id;
    let from = Number(req.params.from);
    let page = Number(req.params.page);
    let productId = req.params.productid == 'all' ? undefined : req.params.productid;

    // Lay danh sach don hang theo id của nhà cung cấp
    let query = {};
    query.providerId = providerId;
    query.productId = productId;

    Order.find(query)
        .skip(from)
        .limit(page)
        .then(list => {
            return res.status(200).json(list);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send("Get list Error");
        });
};

// Lay thong tin chi tiet cua 1 don hang
router.get('/detail/:id', getDetail);

async function getDetail(req, res) {
    console.log('get order by id : ' + req.params.id);
    let id = req.params.id;
    let providerId = req.user._id;
    let query = {
        _id: id,
        providerId: providerId
    }
    Order.findOne(query)
        .then(data => {
            console.log(data);
            return res.status(200).json(docs);
        })
        .catch(error => {
            console.log(error);
            return res.status(404).send("Order not exist!");
        })
};

// Edit Order comment
// body data :
// body = {
//     comment : "comment here"
// }
router.post('/edit-comment/:id', async (req, res) => {
    let providerId = req.user._id;

    let select = {
        _id: req.params.id,
        providerId: providerId
    };
    let updater = {
        $set: {
            "status.0.comment": req.body.comment
        }
    }
    let option = {
        sort: {
            "status": 1
        }
    }

    Order.findOneAndUpdate(select, updater, option)
        .then(result => {
            console.log('Update Order ', result);
            return res.status(200).send('Update success');
        })
        .catch(error => {
            console.log(err);
            return res.status(500).send('Error');
        })
})

// Nhan don hang
router.post('/nhan-don/:id', aceptOrder);

async function aceptOrder (req, res) {
    let orderId = req.params.id;
    let providerId = req.user._id;
    // Lúc này đơn hàng đang trong thời gian chờ duyệt
    // Tìm kiếm số lượng sản phẩm có đủ để nhận đơn không 
    // Nếu đủ số lượng hàng để nhận đơn
    let query = {
        _id : orderId,
        providerId : providerId,
        "status.0.code" : 0
    }

    let status = {
        code: 1,
        commnet: req.body.comment,
        time: Date.now()
    };

    let order = await Order.findOne(query).sort({status : 1}).populate('product');
    console.log(order);
    if(!order.productId.soldAble) return res.status(500).send("San pham dang het hang");
    if(order.quantity > order.productId.maxSold) return res.status(500).send("So luong vuot qua");
};

router.post('/giao-hang/:id', (req, res) => {
    let orderId = req.params.id;
    let providerId = req.user._id;
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
        providerId: providerId,
        "status.0.code": 1
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
                message: 'Giao hàng thành công!'
            });
        };
    });
});

module.exports = router;