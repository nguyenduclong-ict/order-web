// router path : /api/user
const express = require('express');
var router = express.Router();
var User = require('../../models/User');

router.get('/list', (req, res) => {
    User.find({}, ['username', 'email', 'isBlock'], (err, docs) => {
        res.json(docs);
    })
});

router.get('/list/:from-:page', (req, res) => {
    let from = req.params.from;
    let page = req.params.page;
    User.find({}, ['username', 'email', 'isBlock'], { skip : from, limit : page } , (err, docs) => {
        res.status(200).json(docs);
    })
});

router.get('/detail/:id', (req, res) => {
    console.log('get user by id : ' + req.params.id);
    let userId = req.params.id;
    User.findOne({
        _id: userId
    }, ['username', 'email', 'isBlock'], (err, docs) => {
        if (docs)
            return res.status(200).json(docs);
        else return res.json({
            error: "User khong ton tai"
        })
    })
});

// Edit user
router.post('/edit/:id', (req, res) => {
    let query = {_id : req.params.id};
    let data = req.body;
    console.log(data);
    
    User.updateOne(query, data, (err) => {
        if(err) {
            console.log(err);
            return res.json({error : "Xay ra loi", message : err.message});
        } else {
            console.log('Update user ' + req.params.id + 'success!');
            return res.json({message : 'update success!'});
        }
    });
})
module.exports = router;