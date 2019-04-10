// router path : /api/user
const express = require('express');
var router = express.Router();
var User = require('../../models/User');
const File = require('../../models/File')

router.get('/list', (req, res) => {
    User.find({}, ['_id', 'username', 'email', 'isBlock'], (err, docs) => {
        res.json(docs);
    })
});

router.get('/list/:from-:page', getListUserPage);

async function getListUserPage(req, res) {
    let from = Number(req.params.from);
    let page = Number(req.params.page);
    console.log(from, page);
    User.find()
    .skip(from)
    .limit(page)
    .select(['_id', 'username', 'email', 'isBlock'])
    .then(docs => {
        res.json(docs);        
    }) 
}

router.get('/detail/:id', getDetailUserById );

async function getDetailUserById (req, res) {
    let user = await User.findOne({_id : req.params.id})
    console.log(user);
    File.find({owner : user._id , type : 'image',  of : 'user/avatar'})
    .exec()
    .then(images => {
        console.log(images);
        images = images.map(e => e.filename);
        user.info.avatar = images;
        user.password = undefined;
        return res.json(user);
    })
    .catch(error => {
        console.log(error);
        return res.json(user);
    });
};

// Edit user
router.post('/edit/:id', (req, res) => {
    let query = {
        _id: req.params.id
    };
    let data = req.body;
    console.log(data);

    User.updateOne(query, data, (err) => {
        if (err) {
            console.log(err);
            return res.json({
                error: "Xay ra loi",
                message: err.message
            });
        } else {
            console.log('Update user ' + req.params.id + 'success!');
            return res.json({
                message: 'update success!'
            });
        }
    });
})
module.exports = router;