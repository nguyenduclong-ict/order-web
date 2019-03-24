const express = require('express');
var router = express.Router();
var auth = require('../helpers/Auth');
// Login
router.use('/login',  require('./login'));
router.use('/register', require('./register'));
router.use('/provider', auth.authProvider, require('./provider/test'));

module.exports = router;
