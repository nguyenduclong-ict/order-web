var jwt = require("jsonwebtoken");
var jwt_secret = process.env.JWT_SECRET || "default";
var Token = require("../helpers/Token");
var User = require("../models/User");
const NError = require("../helpers/Error");
const File = require("../models/File");
const rootPath = process.env.ROOT_PATH;
const path = require("path");

// Kiem tra token , lay thong tin trong token
async function checkToken(token) {
  token = await Token.find(token);
  if (!token) throw new Error("Not found token in database");
  let tokenData = jwt.verify(token.value, jwt_secret);
  if (!tokenData) throw new Error("Token verify failure");
  return tokenData;
}

// Lấy Barer token from header
async function getTokenFromHeaders(headers) {
  try {
    let authorization = headers.authorization;
    let token = authorization.split(" ")[1];
    console.log("Token : \n", token);
    if (!token) throw new NError("Không có token trên header", 403);
    else {
      return token;
    }
  } catch (error) {
    console.log(error);
    if (error.code) return error;
    else return new Error("Not found token on headers");
  }
}

// Lấy token trong database bằng id lưu trong db
async function checkTokenById(tokenId) {
  token = await Token.findById(tokenId);
  if (!token) throw new NError("Not found token in database");
  let tokenData = jwt.verify(token.value, jwt_secret);
  if (!tokenData) throw new NError("Token verify failure", 403);
  return tokenData;
}

// Lay thong tin user
async function checkUser({ id }) {
  console.log(id);
  // Lay thong tin user
  let user = await User.findById(id);
  if (!user) throw new NError("Không tồn tại tài khoản người dùng của token này");
  return user;
}

async function authAdmin(req, res, next) {
  getTokenFromHeaders(req.headers)
    .then(checkToken)
    .then(checkUser)
    .then(user => {
      if (user.isBlock) throw new Error("Tài khoản đang bị khoá");
      if (user.type !== "admin") throw new Error("Loại tài khoản không đúng");
      req.user = user;
      return next();
    })
    .catch(error => {
      return res.status(403).send(error.message);
    });
}

async function authProvider(req, res, next) {
  getTokenFromHeaders(req.headers)
    .then(checkToken)
    .then(checkUser)
    .then(user => {
      if (user.isBlock) throw new Error("Tài khoản đang bị khoá");
      if (user.type !== "provider") throw new Error("Loại tài khoản không đúng");
      req.user = user;
      return next();
    })
    .catch(error => {
      return res.status(403).send(error.message);
    });
}

async function authCustomer(req, res, next) {
  getTokenFromHeaders(req.headers)
    .then(checkToken)
    .then(checkUser)
    .then(user => {
      if (user.isBlock) throw new Error("Tài khoản đang bị khoá");
      if (user.type !== "customer") throw new Error("Loại tài khoản không đúng");
      req.user = user;
      return next();
    })
    .catch(error => {
      return res.status(403).send(error.message);
    });
}

async function authFile(req, res, next) {
  let filename = req.query.filename;
  let file = await File.findOne({
    filename: filename
  });
  console.log(file, req.method, req._parsedOriginalUrl.pathname);
  req.data = {};
  if (req.method === "GET" && req._parsedOriginalUrl.pathname === "/api/file") {
    req.data.file = file;
    if (!file) return res.sendFile(path.join(rootPath, 'public/img/no-image.png'));
    if (file.isPublic === true) return next();
    let tokenId = req.query.code;
    // Kiem tra dang nhap
    checkTokenById(tokenId)
      .then(checkUser)
      .then(user => {
        req.user = user;
        return next();
      })
      .catch(error => {
        console.log(error);
        if (error.code) return res.status(403).send(error.message);
        else return res.status(403).send("Token bi tu choi");
      });
  }
  if (req.method === "DELETE") {
    // Kiem tra dang nhap
    getTokenFromHeaders(req.headers)
      .then(checkToken)
      .then(checkUser)
      .then(user => {
        console.log(user);
        req.user = user;
        return next();
      })
      .catch(error => {
        console.log(error);
        return res.status(error.code || 403).send(error.message);
      });
  }

  return res.status(500).send();
}

async function getInfoFromToken(req, res, next) {
  getTokenFromHeaders(req.headers)
    .then(checkToken)
    .then(checkUser)
    .then(user => {
      if (user.isBlock) throw new Error("Tài khoản đang bị khoá");
      req.user = user;
      return next();
    })
    .catch(error => {
      console.log(error);
      return res.status(403).send(error.message);
    });
}

module.exports = {
  getTokenFromHeaders,
  checkToken,
  authAdmin,
  authCustomer,
  authProvider,
  authFile,
  getInfoFromToken
};
