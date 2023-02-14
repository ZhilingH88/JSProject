var express = require("express");
const {
  getUserCart,
  addProductToCart,
  reduceAnCartItem,
  removeItemFromCart,
} = require("../controller/Cart");
var router = express.Router();
const { VerifyToken } = require("../middleware/Validation");

/* GET cart page. */
router.get("/getCart", VerifyToken, getUserCart);

/*POST add an item to Cart */
router.post("/addToCart", VerifyToken, addProductToCart);

/*PUT minus an item from Cart */

router.put("/reduceFromCart", VerifyToken, reduceAnCartItem);

/*Delete item from cart*/

router.delete("/removeItemFromCart", VerifyToken, removeItemFromCart);

module.exports = router;
