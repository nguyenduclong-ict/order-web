const router = require("express").Router();
const Discount = require("../../models/Discount");

router.post('/check', postCheckDiscount);

function postCheckDiscount  (req, res) {
    let {productId, discountId} = req.body;
    Discount.methods.checkDiscount(discountId, productId)
        .then(result =>{
            console.log(result);
            return res.json(result);
        })
        .catch(err => {
            return res.json({ok : false , message : 'Không hợp lệ'})
        })
}

module.exports = router;