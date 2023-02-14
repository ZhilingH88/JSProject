var express = require("express");
const {
  Register,
  UserLogin,
  RefreshToken,
  getUser,
  userLogout,
  CreateAdmin,
} = require("../controller/Users");
const { RegisterValidate, VerifyToken } = require("../middleware/Validation");
var router = express.Router();

/* GET users listing. */
router.get("/", VerifyToken, getUser);
// POST user login
router.post("/login", UserLogin);

// GET user refresh token
router.get("/token", RefreshToken);

// POST user register
router.post("/register", RegisterValidate, Register);

//create admin
router.post("/createAdmin", CreateAdmin);

// DELETE user logout
router.delete("/logout", userLogout);

module.exports = router;
// M_S4u6UNCk!jF%U