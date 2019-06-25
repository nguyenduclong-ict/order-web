const router = require("express").Router();
const Cart = require("../../models/Cart");

router.get("/", getCart); // Lay thong tin gio hang
router.post("/remove-product", deleteProductFromCart); // xoa san pham khoi gio hang
router.post("/add-product", postAddToCart); // The san pham vao gio hang

// Lay thong tin cua gio hang của user
async function getCart(req, res) {
  try {
    // usefId
    let userId = req.user._id;
    Cart.methods.getCart(userId).then(cart => {
      // console.log('Router coustmer/cart :',cart.products);
      console.log(cart);
      if(!cart) cart = {};
      return res.json(cart);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

async function deleteProductFromCart(req, res) {
  let products = req.body.products;
  let userId = req.user._id;
  Cart.methods
    .removeFromCart(userId, products)
    .then(result => {
      return res.json({ message: "Thanhf cong " });
    })
    .catch(err => {
      // console.log(err);
      return res.status(500).json({ message: err.message });
    });
}

// Them san pham vao gio hang
async function postAddToCart(req, res) {
  let userId = req.user._id;
  let products = req.body.products;
  console.log('router customer/cart line 41 :', products);
  
  Cart.
  methods
    .addToCart(userId, products)
    .then(result => {
      res.status(200).json({ message: "Add success", result : result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error! Add Failure", error: err.message });
    });
}

module.exports = router;
