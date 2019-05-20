const mongoose = require("../helpers/MyMongoose").mongoose;

var Schema = mongoose.Schema;
var schema = new Schema({
  userId: {
    // userId cho user
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  created: { type: Date, default: Date.now() }
});

let Cart = {};
Cart = mongoose.model("Cart", schema);
Cart.methods = {};

Cart.methods.newCart = Cart => {
  return new Cart(Cart).save();
};

Cart.methods.addToCart = async (userId, products) => {
  let cart = await Cart.findOne({ userId: userId });
  cart.products = [...cart.products,products];
  cart.products = [...new Set(cart.products)];
  return Cart.updateOne({ userId }, cart);
};

// Xoa san pham trong gio hang
Cart.methods.removeFromCart = async (userId, products) => {
  let cart = await Cart.findOne({ userId, userId });
  cart = cart.productsfilter(e => !products.includes(e));
  return Cart.updateOne({ userId: userId }, cart);
};

/**
 * Lay thong tin gio hang
 */
Cart.methods.getCart = async userId => {
  return Cart.findOne({ userId: userId });
};

/**
 *
 * @param {id cua khach hang} userId
 * @param {San pham trong gio hang} productId
 */
async function getProductInCart(userId, productId) {
  let cart = await Cart.findOne({ userId: userId });
  let product = cart.products.find(e => e.productId === productId);
  return product;
}

Cart.methods.getProductInCart = getProductInCart;

// export module
module.exports = Cart;
