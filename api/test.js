const router = require('express').Router();
const User = require('../models/User');

router.get('/:type-:from-:page', (req, res) => {
    let type = req.param('type');
    let from = Number(req.param('from'));
    let page = Number(req.param('page'));
    console.log(type,from,page);
    User.methods.getListUser(type, from, page)
        .then(list => {
            list = list.map(e => e);
            console.log(list);
            return res.json(list);
        })
        .catch(error => {
            console.log(error);
            return res.status(500);
        })
});

module.exports = router;