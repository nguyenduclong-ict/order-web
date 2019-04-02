var jwt = require('jsonwebtoken');
var jwt_secret = process.env.JWT_SECRET || 'default';
var Token = require('../helpers/Token');

function authCustomer(req, res, next) {
    var token = req.headers.token;
    // Kiem tra token con hieu luc khong
    if(!token || token === '') return res.status(403).send('Truy cap bi tu choi');
    Token.find(token).then(doc => {
        if(!doc) return res.status(403).send('Truy cap bi tu choi'); 
        var user = jwt.verify(token, jwt_secret);
        if(user.type != 'customer') return res.status(403).send('Truy cap bi tu choi');
        if(user.isBlock == true) return res.status(403).send('Tai khoan dang bi khoa');
        next();
    }) 
}

function authProvider (req, res, next) {
    var token = req.headers.token;
    // Kiem tra token con hieu luc khong
    //
    if(!token || token === '') return res.status(403).send('Truy cap bi tu choi2');
    Token.find(token).then(doc => {
        if(!doc) return res.status(403).send('Truy cap bi tu choi'); 
        var user = jwt.verify(token, jwt_secret);
        if(user.type != 'provider') return res.status(403).send('Truy cap bi tu choi');
        if(user.isBlock == true) return res.status(403).send('Tai khoan dang bi khoa');
        next();
    }) 
}

function authAdmin (req, res, next) {
    var token = req.headers.token;
    // Kiem tra token con hieu luc khong
    //
    if(!token || token === '') return res.status(403).send('Truy cap bi tu choi');
    Token.find(token).then(doc => {
        if(!doc) return res.status(403).send('Truy cap bi tu choi'); 
        var user = jwt.verify(token, jwt_secret);
        if(user.type != 'admin') return res.status(403).send('Truy cap bi tu choi');
        if(user.isBlock == true) return res.status(403).send('Tai khoan dang bi khoa');
        next();
    }) 
}

module.exports = {
    authAdmin,
    authCustomer,
    authProvider
}