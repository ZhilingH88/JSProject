var express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  editProduct,
  deleteProduct,
} = require("../controller/Products");
const { AdminVerify } = require("../controller/Users");
const { VerifyToken } = require("../middleware/Validation");
var router = express.Router();

//POST create product
router.post("/create", VerifyToken, AdminVerify, createProduct);

//GET all products
router.get("/getAllProducts", getAllProducts);

//GET product by id
router.post("/getProductById", getProductById);

//PUT edit product
router.put("/editProduct", VerifyToken, AdminVerify, editProduct);

//DELETE product
router.delete("/deleteProduct", VerifyToken, AdminVerify, deleteProduct);

module.exports = router;
