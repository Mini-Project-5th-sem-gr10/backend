const express = require("express");
const Router = express.Router();
const sequelize = require("../config/connect.js");
const StudentController = require("../controllers/StudentController.js");
const auth = require("../middleware/auth.js");

Router.get("/getStudent", auth, StudentController.getStudent);

module.exports = Router;
