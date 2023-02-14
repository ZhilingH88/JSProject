const { Products, Cart } = require("../db/model");
const validator = require("validator");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const createProduct = async (req, res) => {
  const { name, description, category, price, quantity, image } = req.body;
  if (
    validator.isEmpty(name) ||
    validator.isEmpty(category) ||
    validator.isEmpty(price) ||
    validator.isEmpty(quantity)
  ) {
    return res.status(400).json({
      status: "error",
      message: "Product Form not finish",
    });
  }
  if (parseInt(quantity) < 0) {
    return res.status(400).json({
      status: "error",
      message: "Quantity can not under 0",
    });
  }
  if (parseFloat(price) < 0) {
    return res.status(400).json({
      status: "error",
      message: "Price can not under 0",
    });
  }
  const product = new Products({
    product_id: uuidv4(),
    name: name,
    description: description,
    category: category,
    price: price,
    quantity: quantity,
    image: image,
  });
  try {
    const newProduct = await product.save();
    if (product === newProduct) {
      res.json({
        status: "success",
        message: "Create Product successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const resp = await Products.find({});
    if (!resp[0])
      return res.json({
        status: "success",
        products: [],
      });
    const products = resp.map((item) => {
      return {
        product_id: item.product_id,
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        createdAt: item.createdAt,
      };
    });
    res.json({
      status: "success",
      products: products,
    });
  } catch (error) {
    console.log(error);
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.body.product_id;
    const resp = await Products.find({ product_id: id });
    if (!resp[0])
      return res.status(404).json({
        status: "error",
        message: "product not found",
      });
    const {
      product_id,
      name,
      description,
      category,
      price,
      quantity,
      image,
      createdAt,
    } = resp[0];
    res.json({
      status: "success",
      product: {
        product_id: product_id,
        name: name,
        description: description,
        category: category,
        price: price,
        quantity: quantity,
        image: image,
        createdAt: createdAt,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const editProduct = async (req, res) => {
  try {
    const edit_data = req.body.edit_part;
    const id = req.body.product_id;
    const resp = await Products.find({ product_id: id });
    if (!resp[0])
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    const { modifiedCount } = await Products.updateOne(
      { product_id: id },
      edit_data
    );
    if (modifiedCount) {
      res.json({
        status: "success",
        message: "Update product successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.body.product_id;
    const resp = await Products.find({ product_id: id });
    if (!resp[0])
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    Cart.deleteMany({ product_id: id }, (err) => {
      if (err) {
        return res.status(405);
      }
    });
    Products.deleteOne({ product_id: id }, (err) => {
      if (err) {
        return res.status(405);
      }
      res.json({
        status: "success",
        message: "Delete product successfully",
      });
    });
  } catch (error) {}
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  editProduct,
  deleteProduct,
};
