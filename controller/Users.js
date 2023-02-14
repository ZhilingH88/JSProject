const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db/model");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { Admin } = require("../db/model");

const FindDataFromDB = async (data) => {
  try {
    const query = await User.find(data);
    return query;
  } catch (error) {
    console.log(error);
  }
};

const Register = async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  const user = new User({
    email: email,
    password: hashPassword,
    user_id: uuidv4(),
  });
  try {
    //add to db
    const data = await FindDataFromDB({ email: email });
    if (data.length === 0) {
      const newUser = await user.save();
      if (newUser === user) {
        res.json({
          message: "Registration Successful",
        });
      }
    } else {
      res.status(404).json({
        message: "Email exist",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await FindDataFromDB({ email: email });
    if (data.length === 0) {
      return res.status(400).json({
        message: "email not exist",
      });
    }
    const pwd = data[0].password;
    const match = await bcrypt.compare(password, pwd);
    if (!match) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }
    const userId = data[0].user_id;
    const userEmail = email;
    const admin_user = await Admin.find({ user_id: userId });
    let isAdmin = false;
    if (admin_user[0]) {
      isAdmin = true;
    }
    const accessToken = jwt.sign(
      { userId, userEmail, isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15s" }
    );
    const refreshToken = jwt.sign(
      { userId, userEmail, isAdmin },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const { modifiedCount } = await User.updateOne(
      {
        id: userId,
        email: userEmail,
      },
      {
        refresh_token: refreshToken,
      }
    );
    if (modifiedCount) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: "true",
        maxAge: 24 * 60 * 60 * 1000,
        domain: null,
      });
      res.json({
        userEmail,
        accessToken,
        isAdmin,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("refreshToken" + refreshToken);
    if (!refreshToken) {
      return res.status(401).json({
        message: "please log in again",
      });
    }
    const user = await FindDataFromDB({ refresh_token: refreshToken });
    if (!user[0]) {
      return res.status(403).json({
        message: "User not exist",
      });
    }
    const admin_user = await Admin.find({ user_id: user[0].user_id });
    let isAdmin = false;
    if (admin_user[0]) {
      isAdmin = true;
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.status(403).json({ message: "Sign in again" });
        const userId = user[0].user_id;
        const userEmail = user[0].email;
        const accessToken = jwt.sign(
          { userId, userEmail, isAdmin },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15s" }
        );
        res.json({
          accessToken,
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await FindDataFromDB({ user_id: req.userId });
    const email = user[0].email;
    const admin_user = await Admin.find({ user_id: req.userId });
    let isAdmin = false;
    if (admin_user[0]) {
      isAdmin = true;
    }
    res.json({
      user: email,
      isAdmin: isAdmin,
    });
  } catch (error) {
    console.log(error);
  }
};
const userLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(204);
    }
    const user = await FindDataFromDB({ refresh_token: refreshToken });
    if (!user[0]) return res.status(204).json({ message: "error" });
    const { modifiedCount } = await User.updateOne(
      {
        user_id: user[0].user_id,
        email: user[0].email,
      },
      {
        refresh_token: null,
      }
    );
    if (modifiedCount) {
      res.clearCookie("refreshToken");
      res.json({
        message: "log out success",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//admin
const CreateAdmin = async (req, res) => {
  const userEmail = req.body.email;
  try {
    const resp = await FindDataFromDB({ email: userEmail });
    if (!resp[0])
      return res.status(404).json({
        message: "user not found",
      });
    const userId = resp[0].user_id;
    const admin = new Admin({ user_id: userId });
    const newAdmin = await admin.save();
    if (newAdmin === admin) {
      res.json({
        message: "Add Admin Successful",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const AdminVerify = async (req, res, next) => {
  try {
    const userId = req.userId;
    const resp = await Admin.find({ user_id: userId });
    console.log(resp);
    if (!resp[0])
      return res.status(404).json({
        message: "Not an admin account",
      });
    next();
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  Register,
  UserLogin,
  RefreshToken,
  getUser,
  userLogout,
  AdminVerify,
  CreateAdmin,
};
