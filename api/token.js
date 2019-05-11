const express = require('express');
var router = express.Router();
const File =require('../models/File');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const tokenGuestExpires = process.env.TOKEN_EXPIRES_GUEST;
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET || 'default';

router.get('/info', getInfo);
router.post('/edit', postEditInfo);
router.post('/change-password', postChangePassword);
router.get('/status', getTokenStatus);
router.get('/guest-token', getGuestToken);

// 
async function getGuestToken(req, res) {
    console.log(req.sessionID);
    let r = Math.random().toString(36).substring(2);
    let payload = {
        ssid : req.sessionID
    }
    let token = jwt.sign( payload , jwt_secret, { expiresIn: tokenGuestExpires });
    res.send(token);
}

// Lấy thông tin user bằng token
async function getInfo (req, res) {
    User.methods.getUser(req.user.email)
        .then(result => {
            user = {...result[0]};
            delete user._id;
            return res.json(user);
        })
        .catch(err => {
            return res.status(500).json({message : 'Không lấy được thông tin từ token'});
        })

    //
};

async function postEditInfo(req, res) {
    let user = req.user;    
    let info = {
        name : req.body.name,
        address : req.body.address,
        phone : req.body.phone
    }
    console.log(info);
    User.updateOne({_id : user._id}, {$set : {info  : info}})
    .exec() 
    .then(result=> {
        console.log('Update User ', user.username, result);
        res.status(200).send({ ok : 1, message  : 'Update Success' });
    })
    .catch(error => {
        console.log(error);
        return res.status(500).send({ message : 'Update Failure' });
    });

}

async function postChangePassword(req, res) {
    let user = req.user;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    try {
        let match = await bcrypt.compare(oldPassword, user.password);
        if (match) {
            let success = await User.updateOne({ _id: user._id }, { $set: { password: newPassword } });
            if (success) return res.json({ success: true, message: 'Thay đổi mật khẩu thành công!' });
        } else throw new Error('Mật khẩu cũ không chính xác');
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: true, message: "Xảy ra lỗi, vui lòng thử lại sau!" });
    }
}

async function getTokenStatus(req, res) {
    console.log(req.user);
    return res.status(200).json({status : 'live', role : req.user.type});
}

module.exports = router;
