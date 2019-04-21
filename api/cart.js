const router = require('express').Router();
const Cart = require('../models/Cart');
const auth = require('../helpers/Auth');
router.get('/', getCart);
router.post('/', auth.authCustomer, joinCart);

// Lay thong tin cua gio hang
async function getCart (req, res) {
    try {
        let token = auth.getTokenFromHeaders(req.headers);
        let tokenData = await auth.checkToken(token);
        Cart.methods.getCart(token._id, token.ssid)
            .then(cart => {
                res.json(cart);
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({message : err.message});
    }
}

async function joinCart(req, res, next) {
    let from = req.body.from;
    let to = req.user._id;
    Cart.methods.joinCart(from, to)
        .then(result =>  {
            return res.json({message : 'Thanhf cong '});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({message : err.message});            
        });
}

module.exports = router;