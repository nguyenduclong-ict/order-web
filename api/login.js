const express = require('express');
var router = express.Router();
var User = require('../models/User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var jwt_secret = process.env.JWT_SECRET || 'default';
var tokenExpires = process.env.TOKEN_EXPIRES || 3600;
var TokenStore = require('../helpers/Token');
// Đăng nhập nhà cung cấp
router.post('/', (req, res) => {
    let data = req.body;
    User.findOne({
        $or: [
            {email: data.email},
            {username : data.username }
        ]
    }, (err, result) => {
        if (err)
            return res.json({
                result: false,
                message: 'Xảy ra lỗi!'
            });
        // Nếu không xảy ra lối
        if (result) {
            // Nếu tài khoản bị khóa
            if (result.isBlock) return res.json({
                result: false,
                message: 'Tài khoản hiện đang bị khóa!'
            });

            // Kiểm tra loại tài khoản đăng nhập
            if (result.type !== data.type) return res.json({
                result: false,
                message: 'Tài khoản không hợp lệ!',
                messdetail: 'Loại tài khoản không chính xác!'
            });
            bcrypt.compare(data.password, result.password, (err, same) => {
                if (err)
                    return res.json({
                        result: false,
                        message: 'Xảy ra lỗi'
                    })
                if (same) {
                    let user = {
                        usename: result.username,
                        email: result.email,
                        type: result.type
                    }
                    let token = jwt.sign( user , jwt_secret, { expiresIn: Number(tokenExpires) });

                    TokenStore.push(token);
                    return res.status(200).json({
                        result: true,
                        message: 'Đăng nhập thành công',
                        token: token
                    })
                } else
                    return res.status(200).json({
                        result: false,
                        message: 'Thông tin đăng nhập không chính xác!'
                    })
            });
        } else
            return res.json({
                result: false,
                message: 'Thông tin đăng nhập không chính xác!'
            })
    })
})


module.exports = router;