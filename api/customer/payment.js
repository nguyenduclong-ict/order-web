const router = require("express").Router();
const Payment = require("../../models/Payment");

router.get('/list', getList);

function getList  (req, res) {
    Payment.methods.getList()
        .then(result =>{
            return res.json(result);
        })
        .catch(err => {
            return res.json({ok : false , message : 'Không hợp lệ'})
        })
}

module.exports = router;