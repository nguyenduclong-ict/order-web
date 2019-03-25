    const express = require('express');
    var router = express.Router();
var User = require('../models/User');

router.post('/customer', (req, res) => {

});
// Đăng kí nhà cung cấp
router.post('/', async (req, res) => {
    let data = req.body;
    userTypes = ['provider', 'admin', 'customer'];
    if( userTypes.includes(data.type) == false) {
        return res.json({result : false, message : 'Loại tài khoản không chính xác'})
    }
    if(data.type === 'provider' || data.type === 'admin')
        data.isBlock = true;
    User.methods.addUser(data)
        .then(result => {
            console.log('Success', result);
            res.json({result : true, message : 'Đăng kí thành công!'})
        })
        .catch(err => {
            console.log('Error', err);
            let message = 'Đăng kí thất bại';
            if(err.code === 11000) message += ', Email hoặc Username đã có người sử dụng!';
            res.json({resut : false, message : message})
        });
});

// Đăng kí 
module.exports = router;