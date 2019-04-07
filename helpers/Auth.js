var jwt = require('jsonwebtoken');
var jwt_secret = process.env.JWT_SECRET || 'default';
var Token = require('../helpers/Token');
var User = require('../models/User');
const NError = require('../helpers/Error');
// Kiem tra token , lay thong tin trong token
async function checkToken(token) {
    token = await Token.find(token);
    if (!token)
        throw new Error("Not found token in database");
    let tokenData = jwt.verify(token.value, jwt_secret);
    if (!tokenData) throw new Error("Token verify failure");
    return tokenData;
}

// 
async function checkTokenById(tokenId) {
    token = await Token.findById(tokenId);
    if (!token) throw new NError("Not found token in database");
    let tokenData = jwt.verify(token.value, jwt_secret);
    if (!tokenData) throw new NError("Token verify failure", 403);
    return tokenData;
}

// Lay thong tin user
async function checkUser(userId) {
    // Lay thong tin user
    let user = await User.findById(userId);
    if (!user) throw new NError("Không tồn tại tài khoản người dùng");
    return user;
}

async function authAdmin(req, res, next) {
    checkToken(req.headers.token)
        .then(tokenData => checkUser(tokenData.id))
        .then(user => {
            if (user.isBlock) throw new Error("Tài khoản đang bị khoá");
            if (user.type !== 'admin') throw new Error("Loại tài khoản không đúng");
            return next();
        }).catch(error => {
            return res.status(403).send(error.message);
        })
}

async function authProvider(req, res, next) {
    checkToken(req.headers.token)
        .then(tokenData => checkUser(tokenData.id))
        .then(user => {
            if (user.isBlock) throw new Error("Tài khoản đang bị khoá");
            if (user.type !== 'provider') throw new Error("Loại tài khoản không đúng");
            req.user = user;
            return next();
        }).catch(error => {
            return res.status(403).send(error.message);
        });
}

async function authCustomer(req, res, next) {
    checkToken(req.headers.token)
        .then(tokenData => checkUser(tokenData.id))
        .then(user => {
            if (user.isBlock) throw new Error("Tài khoản đang bị khoá");
            if (user.type !== 'customer') throw new Error("Loại tài khoản không đúng");
            req.user = user;
            return next();
        }).catch(error => {
            return res.status(403).send(error.message);
        })
}

async function authFile(req, res, next) {
    let tokenId = req.query.code;
    checkTokenById(tokenId)
        .then(tokenData => checkUser(tokenData.id))
        .then(user => {
            req.user = user;
            return next();
        }).catch(error => {
            console.log(error);
            if (error.code) return res.status(403).send(error.message);
            else return res.status(403).send("Token bi tu choi");
        });
}

async function getInfoFromToken(req, res, next) {
    checkToken(req.headers.token)
        .then(tokenData => checkUser(tokenData.id))
        .then(user => {
            if (user.isBlock) throw new Error("Tài khoản đang bị khoá");
            user.password = undefined;
            req.user = user;
            return next();
        }).catch(error => {
            return res.status(403).send(error.message);
        });
}

module.exports = {
    authAdmin,
    authCustomer,
    authProvider,
    authFile,
    getInfoFromToken
}