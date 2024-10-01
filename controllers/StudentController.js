const sequelize = require("../config/connect.js");

const getStudent = async (req, res) => {
  try {
    const { id, role } = req.user;
    const [student, metadata] = await sequelize.query(
      `SELECT s_id,name,roll_no,sec_id,img_src FROM students WHERE s_id = :s_id`,
      { replacements: { s_id: id } }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ student: student });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { getStudent };
