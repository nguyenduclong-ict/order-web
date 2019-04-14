

const express = require('express');
var router = express.Router();
var auth = require('../helpers/Auth');
// redirect router
router.use('/login',  require('./login'));
router.use('/logout',  require('./logout'));
router.use('/register', require('./register'));
router.use('/upload', require('./upload'));
router.use('/file', auth.authFile, require('./file'));
router.use('/token', auth.getInfoFromToken, require('./token'));
router.use('/test', require('./test'));
// Router admin
router.use('/admin/*', auth.authAdmin);
router.use('/admin/user',  require('./admin/user'));
router.use('/admin/category', require('./admin/category'));
router.use('/admin/payment', require('./admin/payment'));
router.use('/admin/discount', require('./admin/discount'));
router.use('/admin/list', require('./admin/list'));

// Router provider
router.use('/provider/*', auth.authProvider);
router.use('/provider/product', require('./provider/product'));
router.use('/provider/order', require('./provider/order'));

module.exports = router;
