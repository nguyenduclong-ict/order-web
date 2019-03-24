const express = require('express');
var router = express.Router();
var Customer = require('../../models/Customer');
router.get('/', (req, res) => {
    res.send('Hello Router Provider');
});

module.exports = router;