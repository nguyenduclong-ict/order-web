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
    let user = req.user;
    console.log(req.user);
    File.find({owner : user._id , of : 'user/avatar'})
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

async function postEditInfo(req, res) {
    let user = req.user;    
    let info = {
        name : req.body.name,
        address : req.body.address,
        phone : req.body.phone
    }
    console.log(data);
    User.updateOne({_id : user._id}, {$set : {info  : info}})
    .exec() 
    .then(result=> {
        console.log('Update User ', user.username, result);
        res.status(200).send('Update thanh cong');
    })
    .catch(error => {
        console.log(error);
        return res.status(500).send('Update that bai');
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
    return res.json(200).send('live');
}

module.exports = router;
