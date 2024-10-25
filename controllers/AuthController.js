const sequelize = require("../config/connect.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { id, password } = req.body;

    // Parameterized query to prevent SQL injection
    const [student, metadata] = await sequelize.query(
      `SELECT * FROM students WHERE s_id = :s_id`,
      { replacements: { s_id: id } }
    );
    const [faculty, metadata1] = await sequelize.query(
      `SELECT * FROM faculty WHERE f_id = :f_id`,
      { replacements: { f_id: id } }
    );

    if (!student.length && !faculty.length) {
      return res.status(404).json({ message: "Student Doesn't Exist" });
    }
    const role = student.length ? "student" : "faculty";

    const userData = student.length ? student[0] : faculty[0]; // Access the student data

    const isMatch = await bcryptjs.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const payload = {
      role: role,
      id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .json({ message: "Logged In Successfully", token: token, role: role });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const { id, role } = req.user;
    const roleTableMap = {
      student: { table: "students", idField: "s_id" },
      faculty: { table: "faculty", idField: "f_id" },
    };

    if (!roleTableMap[role]) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const { table, idField } = roleTableMap[role];

    const [userData] = await sequelize.query(
      `SELECT ${idField} AS id, name, img_src 
       FROM ${table} 
       WHERE ${idField} = :id`,
      { replacements: { id } }
    );

    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ ...userData[0], role: role }); // Return the first result
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { login, getUserInfo };
