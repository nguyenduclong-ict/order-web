// router path : /api/user
const express = require('express');
var router = express.Router();
var User = require('../../models/User');

router.get('/list/:type-:from-:page', getListUserPage);
router.get('/detail/:username', getUserByUsername );
router.post('/block/:id', postBlock);
router.post('/unblock/:id', postUnBlock);

async function getListUserPage(req, res) {
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
}


async function getUserByUsername (req, res) {
    let username = req.params.username;
    try {
        let user = await User.methods.getUser(username);
        console.log(user);
        return res.json(user[0]);
    } catch (error) {
        return res.status(500).send("Xay ra loi trong Server");
    }
    
};

// Block user
function postBlock (req, res)  {
    let query = {
        _id: req.params.id
    };
    User.updateOne(query, {$set : {isBlock : true}}, (err) => {
        if (err) {
            console.log(err);
            return res.json({
                error: "Xay ra loi",
                message: err.message
            });
        } else {
            console.log('Block user ' + req.params.id + 'success!');
            return res.json({
                message: 'Block success!'
            });
        }
    });
};


// UnBlock user

function postUnBlock(req, res) {
    let query = {
        _id: req.params.id
    };

    User.updateOne(query, {$set : {isBlock : false}}, (err) => {
        if (err) {
            console.log(err);
            return res.json({
                error: "Xay ra loi",
                message: err.message
            });
        } else {
            console.log('UnBlock user ' + req.params.id + 'success!');
            return res.json({
                message: 'unBlock success!'
            });
        }
    });
};


module.exports = router;