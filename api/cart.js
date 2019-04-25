const router = require("express").Router();
const Cart = require("../models/Cart");
const auth = require("../helpers/Auth");

router.get("/", getCart);
router.get("/cart-detail", auth.authCustomer, getCartOfUser);
router.get("/add-to-cart", auth.authCustomer, removeFromCart);
router.post("/join", auth.authCustomer, postJoinCart);
router.post("/add-to-cart", auth.authCustomer, postAddToCart);

// Lay thong tin cua gio hang
async function getCart(req, res) {
  try {
    let token = auth.getTokenFromHeaders(req.headers);
    let tokenData = await auth.checkToken(token);
    Cart.methods.getCart(token._id, token.ssid).then(cart => {
      res.json(cart);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

// Lay thong tin cua gio hang của user
async function getCartOfUser(req, res) {
  try {
    // usefId
    let userId = req.user._id;
    Cart.methods.getCart(userId).then(cart => {
      res.json(cart);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

async function postJoinCart(req, res, next) {
  let from = req.body.from;
  let to = req.user._id;
  Cart.methods
    .joinCart(from, to)
    .then(result => {
      return res.json({ message: "Thanhf cong " });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ message: err.message });
    });
}

async function getRemoveFromCart(req, res) {
  let orderId = req.params.id;
  let userId = req.user._id;
  Cart.methods
    .removeFromCart(userId, undefined, orderId)
    .then(result => {
      return res.json({ message: "Thanhf cong " });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ message: err.message });
    });
}

// Them san pham vao gio hang
async function postAddToCart(req, res) {
  let userId = req.user._id;
  let ssid = req.tokenData.ssid;
  let { productId, quantity } = req.body;
  Cart.methods
    .addToCart(userId, ssid, productId, quantity)
    .then(result => {
      res.status(200).json({ message: "Add success" });
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: "Error! Add Failure", error: err.message });
    });
}

module.exports = router;
