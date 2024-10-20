const express = require("express");
const Router = express.Router();
const TeacherController = require("../controllers/TeacherController");
const auth = require("../middleware/auth");

Router.get("/getTeacher", auth, TeacherController.getTeacher);
Router.get("/getStudentList", auth, TeacherController.getStudentList);

module.exports = Router;
