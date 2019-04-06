var jwt = require('jsonwebtoken');
var jwt_secret = process.env.JWT_SECRET || 'default';
var Token = require('../helpers/Token');
var User = require('../models/User');

function authCustomer(req, res, next) {
    var token = req.headers.token;
    // Kiem tra token con hieu luc khong
    //
    if (!token || token === '') return res.status(403).send('Truy cập bị từ chối');
    Token.find(token).then(doc => {
        if (!doc) return res.status(403).send('Truy cập bị từ chối');
        jwt.verify(token, jwt_secret, (err, user) => {
            let result;
            if (err) {
                switch (err.name) {
                    case 'TokenExpiredError':
                        result = {
                            code: 403,
                            message: "Token hết hạn"
                        }
                    default:
                        result = {
                            code: 403,
                            message: "Truy cập bị từ chối"
                        };
                }
            }
            if (user.type != 'customer') {
                result = {
                    code: 430,
                    message: 'Truy cập bị từ chối'
                }
            }
            if (user.isBlock == true) {
                result = {
                    code: 430,
                    message: 'Tài khoản đang bị khoá'
                }
            }
            if (result !== '') {
                Token.remove({
                    value: token
                }, (ok) => {
                    return res.status(430).send(result);
                });
            }
            next();
        });
    });
}
async function authProvider(req, res, next) {
    var token = req.headers.token;
    // Kiem tra token con hieu luc khong
    try {
        // Tìm token trong csdl
        token = await Token.find(token);
        if(!token) return  res.status(430).send('Token không hợp lệ');
        // console.log(token);
        // Kiểm tra token còn hiệu lực không ?
        let tokenData = jwt.verify(token.value, jwt_secret);
        if(!tokenData) return res.status(430).send('Token không hợp lệ');

        // Kiểm tra tài khoản có bị khoá không ?
        let user = await User.findById(tokenData.id);
        // console.log(user);
        if(!user) return res.status(430).send('Token không hợp lệ');
        if(user.isBlock) return  res.status(403).send('Tài khoản đang bị khoá');
        if(user.type !== 'provider') return res.status(403).send('Tài khoản không hợp lệ'); // Loại tài khoản không hợp lệ

        // Lấy ra thông tin nhà cung cấp
        req.user = user;
        return next();
    } catch (err) {
        console.log(err);
        if(err.name == 'TokenExpiredError') 
        return res.status(430).send('Token hết hạn');
        return res.status(430).send('Lỗi khi kiểm tra token');
    }
}


async function authAdmin(req, res, next) {
    var token = req.headers.token;
    // Kiem tra token con hieu luc khong
    //
    try {
        // Tìm token trong csdl
        token = await Token.find(token);
        if(!token) return  res.status(430).send('Token không hợp lệ');
        // console.log(token);
        // Kiểm tra token còn hiệu lực không ?
        let tokenData = jwt.verify(token.value, jwt_secret);
        if(!tokenData) return res.status(430).send('Token không hợp lệ');

        // Kiểm tra tài khoản có bị khoá không ?
        let user = await User.findById(tokenData.id);
        // console.log(user);
        if(!user) return res.status(430).send('Token không hợp lệ');
        if(user.isBlock) return  res.status(403).send('Tài khoản đang bị khoá');
        if(user.type !== 'admin') return res.status(403).send('Tài khoản không hợp lệ'); // Loại tài khoản không hợp lệ
        return next();
    } catch (err) {
        console.log(err);
        if(err.name == 'TokenExpiredError') 
            return res.status(430).send('Token hết hạn');
        return res.status(430).send('Lỗi khi kiểm tra token');
    }
}

module.exports = {
    authAdmin,
    authCustomer,
    authProvider
}