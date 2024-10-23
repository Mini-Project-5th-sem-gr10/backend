const express = require("express");
const Router = express.Router();
const AttendanceController = require("../controllers/AttendanceController");

Router.post(
  "/attendance/mark",
  AttendanceController.upload.array("images"),
  AttendanceController.markAttendance
);
Router.put("/attendance/edit", AttendanceController.editAttendance);

module.exports = Router;
