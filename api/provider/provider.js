const express = require('express');
const router = express.Router();
const User = require('../../models/User');
var bcrypt = require('bcrypt');

router.get('/info', getInfo);
router.post('/edit', postEdit);
router.post('/change-password', changePassword);

async function getInfo(req, res) {
    return res.status(200).json(req.user);
}

async function postEdit(req, res) {
    let info = req.body.info;
    let userId = req.user._id;
    User.findOneAndUpdate(userId, { $set: { info: info } }, (err) => {
        if (err) {
            console.log(err);
            return res.json(500).send("Co loi xay ra");
        }

        res.send("Cập nhật thành công!");
    });
}

async function changePassword(req, res) {
    let userId = req.user._id;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    try {
        let user = await User.findById(userId);
        if (!user) throw new Error('Không tồn tại tài khoản');
        let match = await bcrypt.compare(oldPassword, user.password);
        if (match) {
            let success = await User.updateOne({ _id: userId }, { $set: { password: newPassword } });
            if (success) return res.json({ success: true, message: 'Thay đổi mật khẩu thành công!' });
        } else {
            return res.status(500).json({ error: true, message: 'Mật khẩu cũ không chính xác' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: true, message: "Xảy ra lỗi, vui lòng thử lại sau!" });
    }
};

module.exports = router;