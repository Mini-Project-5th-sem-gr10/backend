const express = require("express");
const Router = express.Router();
const AuthController = require("../controllers/AuthController");
const auth = require("../middleware/auth");

Router.post("/auth/login", AuthController.login);
Router.get("/auth/getUser", auth, AuthController.getUserInfo);

module.exports = Router;
