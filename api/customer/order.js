/*
 * @Author: Long Nguyễn 
 * @Date: 2019-04-09 10:16:37 
 * @Last Modified by: Long Nguyễn
 * @Last Modified time: 2019-04-21 15:56:58
 */

const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Payment = require('../../models/Payment');
const NError = require('../../helpers/Error');

// Setup router
router.post('/add', postOrder);
router.get('/list', getListOrder);
router.post('/cancel-order', postCancelOrder);
router.post('/add-to-cart', postAddToCart);
router.post('/success-order', postAddToCart);
router.post('/change-product-count', postChangeOrderQuantity);

/**
 * Body : orderId, userId, quantity
 */
async function postChangeOrderQuantity(req, res) {
    let orderId = req.body.orderId;
    let userId = req.user._id;
    let quantity = req.body.quantity;
    
    try {
        let order = Order.findOne({_id : orderId, userId :userId}).populate('productId');
        if(!order) throw new NError('Không tồn tại đơn hàng', 404);
           
        if (quantity > order.productId.maxSold) throw new NError('Số lượng đặt vượt quá cho phép', 500);
        if (!payment) throw new NError('Không tìm thấy phương thức thanh toán', 404);

        order.payment = payment._id;
        order.quantity = quantity;

        let result = await Order.updateOne({_id : orderId}, order);
        if(result) return res.send('Đặt hàng thành công');
        else throw new NError('Đặt hàng thất bại', 500);
    } catch (error) {
        if (error.code) return res.status(error.code).send(error.message);
        else return res.status(500).send('Error');
    }
}

/**
 * Body : orderId, comment, paymentId, quantity
 */

 /** Quy trinh
  * 1 Lấy thông tin trong giở hàng
  * 2 Kiểm tra sản phẩm có thể mua không và số lượng đặt mua có hợp lệ không
  * 3 Kiểm tra phương thức thanh toán có hợp lệ không
  * 4 Tạo đơn đặt hàng mới
  * 5 Xoá đơn hàng khỏi giỏ hàng
  */
async function postOrder(req, res) {
    let userId = req.user._id;
    let orderId = req.body.orderId;
    let commnet = req.body.comment;
    let paymentId = req.body.paymentId;
    let quantity = req.body.quantity;
    try {
        // 1
        
        let order = Order.findOne({_id : orderId, userId :userId}).populate('productId'); // 
        if(!order) throw new NError('Không tồn tại đơn hàng', 404);
           
        if (quantity > order.productId.maxSold) throw new NError('Số lượng đặt vượt quá cho phép', 500);
        else order.quantity = quantity;
        let payment = await Payment.findOne({
            _id: paymentId
        });
        if (!payment) throw new NError('Không tìm thấy phương thức thanh toán', 404);

        order.payment = payment._id;
        order.status.push({
            code : 0,
            comment : commnet,
            time : Date.now()
        })

        let result = await Order.updateOne({_id : orderId}, order);
        if(result) return res.send('Đặt hàng thành công');
        else throw new NError('Đặt hàng thất bại', 500);
    } catch (error) {
        if (error.code) return res.status(error.code).send(error.message);
        else return res.status(500).send('Error');
    }
}

/**
 * Get list Order by user
 */
async function getListOrder(req, res) {
    let userId = req.user._id;
    Order.find({
            customerId: userId
        })
        .then(list => {
            console.log(list);
            return res.status(200).json(list);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send("get list Order error");
        });
}

// Huy don dat hang
/**
 * Body " orderid"
 * @param {*} req 
 * @param {*} res 
 */
async function postCancelOrder(req, res) {
    let userId = req.user._id;
    let orderId = req.body.orderId;
    let comment = req.body.comment;
    try {
        let order = await Order.findOne({
            userId: userId,
            _id: orderId
        });
        if (!order) throw new NError("Không tìm thấy đơn đặt hàng", 500);
        order.status.sort((a,b) => { return a.code > b.code});
        if (order.status[0].code != 0) throw new NError('Không thể huỷ đơn hàng đã xác nhận', 500);
        // Huỷ đơn hàng 
        order.status.push({
            code : 4, 
            comment : comment,
            time : Date.now()
        });
        let result = await Order.updateOne({_id : orderId}, order);  
        if(result) return res.status(200).send('Huy don hang thanh cong');
        else throw new NError("Huy don hang that bai", 500);
    } catch (error) {
        if (error.code) return res.status(error.code).send(error.message);
        else return res.status(500).send('Error');

    }
}

// Xac nhan nhan hang thanh cong!
/**
 * Body : orderId, comment
 */
async function postSuccessOrder (req, res) {
    let orderId = req.body.orderId;
    let comment = req.body.comment;
    let userId = req.user._id;
    try {
        let order = await Order.findOne({
            userId: userId,
            _id: orderId
        });
        if (!order) throw new NError("Không tìm thấy đơn đặt hàng", 500);
        order.status.sort((a,b) => { return a.code > b.code});
        if (order.status[0].code != 2) throw new NError('Đơn chưa được giao', 500);

        // Xac nhan nhan hang 
        order.status.push({
            code : 3, 
            comment : comment,
            time : Date.now()
        })
        let result = await Order.updateOne({_id : orderId}, order);  
        if(result) return res.status(200).send('Huy don hang thanh cong');
        else throw new NError("Huy don hang that bai", 500);
    } catch (error) {
        if (error.code) return res.status(error.code).send(error.message);
        else return res.status(500).send('Error');

    }
}

async function postAddToCart(req, res) {
    let userId = req.user._id;
    let productId = req.body.productId;
    let paymentId = req.body.paymentId;
    
    try {
        let product = await Product.findOne({
            _id: productId
        });
        if (!product) throw new NError('San pham khong ton tai', 404);
        let payment = await Payment.findOne({
            _id: paymentId
        });
        if (!payment) throw new NError('Không tìm thấy phương thức thanh toán', 404);
        let doc = {
            userId: userId,
            productId: productId,
            paymentId: paymentId,
            quantity: 1,
            status: {
                code: -1,
                comment: 'Đã thêm vào giỏ hàng',
                time: Date.now()
            }
        }
        let order = new Order(doc);
        let result = order.save();
        if (result) return res.status(200).send('Dat hang thanh cong');
        else throw new NError('Co loi xay ra, đặt hàng thất bại', 500);
    } catch (error) {
        if (error.code) return res.status(error.code).send(error.message);
        else return res.status(500).send('Error');
    }
}

module.exports = router;