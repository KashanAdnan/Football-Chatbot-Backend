const UserModel = require("../model/user.model.js");
const sendToken = require("../utils/send.token.js");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const User = await UserModel.create({
    name,
    email,
    password,
  });
  sendToken(User, 201, res);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, msg: "Please Enter Email and Password" });
  }
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    res.status(400).json({ success: false, msg: "Invalid Email and Password" });
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    res.status(400).json({ success: false, msg: "Invalid    and Password" });
  }

  const token = user.getJWTToken();
  res.status(200).json({
    succes: true,
    user,
    token,
  });
};
const Logout = async (req, res, next) => {
  res.cookie("Token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    succes: true,
    message: "Logout Succesfull",
  });
};

const profile = async (req, res) => {
  const { token } = req.body;
  jwt.verify(token, process.env.JWTSecret, async (err, decoded) => {
    if (err) {
      res.status(200).send({
        succes: false,
        err,
      });
      return;
    }
    const { id } = decoded;
    const user = await UserModel.findById({ _id: id });
    res.status(200).json({
      succes: true,
      user,
    });
  });
};

module.exports = {
  createUser,
  loginUser,
  Logout,
  profile,
};
