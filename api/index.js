const express = require('express');
var router = express.Router();
var auth = require('../helpers/Auth');
// redirect router
router.use('/login',  require('./login'));
router.use('/register', require('./register'));
router.use('/provider', auth.authProvider, require('./provider/test'));
router.use('/upload', require('./upload'));
// Router admin
router.use('/admin/*', auth.authAdmin);
router.use('/admin/user',  require('./admin/user'));
router.use('/admin/category', require('./admin/category'));
module.exports = router;
