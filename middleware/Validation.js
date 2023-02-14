const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const RegisterValidate = (req, res, next) => {
  const { email, password } = req.body;
  const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const isStrong = password_regex.test(password);
  if (validator.isEmail(email) && isStrong) {
    next();
  } else {
    res.status(400).json({
      status: "error",
      message: "Invalid user email and password",
    });
  }
};

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (token === null) return res.status(403);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).json({
        message: "error",
      });
    }
    console.log(decoded);
    req.userEmail = decoded.userEmail;
    req.userId = decoded.userId;
    next();
  });
};

module.exports = { RegisterValidate, VerifyToken };
