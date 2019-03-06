const express = require('express');
var router = express.Router();
var auth = require('../helpers/Auth');
// Login
importRoute('/login',  './login');
importRoute('/register', './register');
importRoute('/provider', './provider/test', auth.authProvider);
// Ham import route
function importRoute( urlPath, filePath, auth ) {
    let route = require(filePath);
    if(auth) 
        router.use(urlPath, auth , route);
    else 
        router.use(urlPath, route);
}

module.exports = router;
