const express = require("express");
const Router = express.Router();
const StudentController = require("../controllers/StudentController.js");
const auth = require("../middleware/auth.js");

Router.get("/getStudent", auth, StudentController.getStudent);
Router.post(
  "/getStudentAttendence",
  auth,
  StudentController.getStudentAttendance
);

module.exports = Router;
