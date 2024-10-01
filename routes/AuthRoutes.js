const express = require("express");
const Router = express.Router();
const AuthController = require("../controllers/AuthController");

Router.post("/auth/login", AuthController.login);

module.exports = Router;
