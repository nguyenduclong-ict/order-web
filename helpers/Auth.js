var jwt = require('jsonwebtoken');
var jwt_secret = process.env.JWT_SECRET || 'default';
var TokenStore = require('../helpers/TokenStore');

function authCustomer(req, res, next) {
    var token = req.headers.token;
    // Kiem tra token con hieu luc khong
    if(!TokenStore.Store.includes(token)) return res.status(403).send('Truy cap bi tu choi');
    if(!token || token === '') return res.status(403).send('Truy cap bi tu choi');
    var user = jwt.verify(token, jwt_secret);
    if(user.type != 'customer') return res.status(403).send('Truy cap bi tu choi');
    next();
}

function authProvider (req, res, next) {
    var token = req.headers.token;
    // Kiem tra token con hieu luc khong
    console.log(TokenStore.Store);
    if(!TokenStore.Store.includes(token)) return res.status(403).send('Truy cap bi tu choi1');
    //
    if(!token || token === '') return res.status(403).send('Truy cap bi tu choi2');
    var user = jwt.verify(token, jwt_secret);
    if(user.type != 'provider') return res.status(403).send('Truy cap bi tu choi3');
    next();
}

function authAdmin (req, res, next) {
    var token = req.headers.token;
    // Kiem tra token con hieu luc khong
    if(!TokenStore.Store.includes(token)) return res.status(403).send('Truy cap bi tu choi');
    //
    if(!token || token === '') return res.status(403).send('Truy cap bi tu choi');
    var user = jwt.verify(token, jwt_secret);
    if(user.type != 'provider') return res.status(403).send('Truy cap bi tu choi');
    next();
}

module.exports = {
    authAdmin,
    authCustomer,
    authProvider
}