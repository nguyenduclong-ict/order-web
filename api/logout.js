const Token = require('../helpers/Token');
const router = require('express').Router();

router.get('/', (req, res) => {
    var token = req.headers.token;
    Token.remove(token)
        .then(result => {
            if (result) res.status(200).json({
                message: "dang xuat thanh cong"
            });
            else return res.status(500).json({
                error: true,
                message: "Dang xuat that bai"
            });
        })
        .catch (err =>  {
            console.log(err);
            res.status(500).json({
                error: true,
                message: "Dang xuat that bai"
            });
        });
})
module.exports = router;