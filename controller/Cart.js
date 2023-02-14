const { Cart, Products, User } = require("../db/model");
require("dotenv").config();

const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;
    const resp = await Cart.find({ user_id: userId });
    if (!resp[0]) {
      return res.json({
        status: "success",
        cartItems: [],
      });
    }
    const cartItems = await Promise.all(
      resp.map(async (item) => {
        const product = await Products.find({ product_id: item.product_id });
        console.log(item.product_id);
        let isEnough = true;
        if (product[0].quantity < item.quantity) {
          isEnough = false;
        }
        return {
          product_id: product[0].product_id,
          name: product[0].name,
          stock: product[0].quantity,
          quantity: item.quantity,
          image: product[0].image,
          price: product[0].price,
          isEnough: isEnough,
        };
      })
    );
    if (cartItems) {
      res.json({
        status: "success",
        cartItems: cartItems,
      });
    } else {
      res.json({
        status: "success",
        cartItems: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const addProductToCart = async (req, res) => {
  try {
    const productId = req.body.product_id;
    const userId = req.userId;
    const resp = await Cart.find({ user_id: userId, product_id: productId });
    if (!resp[0]) {
      const CartItem = new Cart({
        user_id: userId,
        product_id: productId,
        quantity: 1,
      });
      const newCartItem = await CartItem.save();
      if (newCartItem === CartItem) {
        return res.json({ state: "success", message: "product added Cart" });
      }
    } else {
      cartItem = {
        user_id: userId,
        product_id: productId,
      };
      const need = parseInt(resp[0].quantity) + 1;
      const product = await Products.find({ product_id: productId });
      if (!product[0]) return res.status(404);
      const stock = product[0].quantity;
      if (stock < need) {
        return res
          .status(403)
          .json({ status: "error", message: "Stock's not enough" });
      }
      const { modifiedCount } = await Cart.updateOne(
        { user_id: userId, product_id: productId },
        { quantity: need }
      );
      if (modifiedCount) {
        res.json({
          status: "success",
          message: "product added Cart",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const reduceAnCartItem = async (req, res) => {
  const userId = req.userId;
  const productId = req.body.product_id;
  const resp = await Cart.find({ user_id: userId, product_id: productId });

  if (resp[0]) {
    const need = resp[0].quantity - 1;
    if (need <= 0) {
      const { deletedCount } = await Cart.deleteOne({
        user_id: userId,
        product_id: productId,
      });
      if (deletedCount) {
        return res.json({
          status: "success",
          message: "Item remove",
        });
      }
    } else {
      const { modifiedCount } = await Cart.updateOne(
        {
          user_id: userId,
          product_id: productId,
        },
        { quantity: need }
      );
      if (modifiedCount) {
        res.json({
          status: "success",
          message: "Remove an item",
        });
      }
    }
  } else {
    res.status(404);
  }
};

const removeItemFromCart = async (req, res) => {
  const userId = req.userId;
  const productId = req.body.product_id;
  const resp = await Cart.find({ user_id: userId, product_id: productId });
  if (resp[0]) {
    const { deletedCount } = await Cart.deleteOne({
      user_id: userId,
      product_id: productId,
    });
    if (deletedCount) {
      return res.json({
        status: "success",
        message: "Item remove",
      });
    }
  }
};

module.exports = {
  getUserCart,
  addProductToCart,
  reduceAnCartItem,
  removeItemFromCart,
};
