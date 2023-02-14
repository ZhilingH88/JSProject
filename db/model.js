const mongoose = require("mongoose");
const adminSchema = require("./schema/adminSchema");
const cartSchema = require("./schema/cartSchema");
const productSchema = require("./schema/productSchema");
const userSchema = require("./schema/userSchema");

const User = mongoose.model("User", userSchema);
const Products = mongoose.model("Products", productSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Cart = mongoose.model("Cart", cartSchema);
module.exports = { User, Products, Admin, Cart };
