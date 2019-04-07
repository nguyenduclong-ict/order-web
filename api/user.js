const express = require('express');
var router = express.Router();

router.get('/info', getInfo);

async function getInfo (req, res) {
    res.json(req.user);
}
module.exports = router;