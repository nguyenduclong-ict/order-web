var jwt = require('jsonwebtoken');
var jwt_secret = process.env.JWT_SECRET || 'default';
var Token = require('../helpers/Token');

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

function authProvider(req, res, next) {
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
            if (user.type != 'provider') {
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
            if (result) {
                Token.remove(token).then(() => {
                    return res.status(403).send(result);
                })
            }
            next();
        });
    });
}


function authAdmin(req, res, next) {
    var token = req.headers.token;
    // Kiem tra token con hieu luc khong
    //
    if (!token || token === '') return res.status(403).send('Truy cập bị từ chối');
    Token.find(token).then(doc => {
        if (!doc) return res.status(403).send({ code : 430 , message : 'Truy cập bị từ chối'});
        jwt.verify(token, jwt_secret, (err, user) => {
            let result = undefined;
            if (err) {
                console.log(err);
                switch (err.name) {
                    case 'TokenExpiredError':
                        result = {
                            code: 403,
                            message: "Token hết hạn"
                        }
                        break;
                    default:
                        result = {
                            code: 403,
                            message: "Truy cập bị từ chối"
                        };
                }
            }
            if (!result && user.type != 'admin') {
                result = {
                    code: 430,
                    message: 'Truy cập bị từ chối'
                }
            }
            if (!result && user.isBlock == true) {
                result = {
                    code: 430,
                    message: 'Tài khoản đang bị khoá'
                }
            }
            if (result) {
                Token.remove(token).then(() => {
                    return res.status(403).send(result);
                })
            } else 
                next();
        });
    });
}

module.exports = {
    authAdmin,
    authCustomer,
    authProvider
}