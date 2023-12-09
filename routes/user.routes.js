const UserController = require("../controller/user_controller");
const express = require("express");
const UserRoute = express.Router();

UserRoute.post("/signUp", UserController.createUser);
UserRoute.post("/login", UserController.loginUser);
UserRoute.get("/logout", UserController.Logout);
UserRoute.post("/profile", UserController.profile);
 
module.exports = UserRoute;