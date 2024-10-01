const sequelize = require("../config/connect.js");

const getStudent = async (req, res) => {
  try {
    const { id } = req.user;

    const [studentData, metadata] = await sequelize.query(
      `SELECT 
         s.s_id,
         s.name AS student_name,
         s.roll_no,
         s.sec_id,
         s.img_src AS student_img,
         c.c_id,
         c.name AS course_name,
         f.f_id,
         f.name AS faculty_name,
         f.img_src AS faculty_img
       FROM
         students s
       JOIN 
         teaches t ON s.sec_id = t.sec_id
       JOIN 
         courses c ON t.c_id = c.c_id
       JOIN 
         faculty f ON t.f_id = f.f_id
       WHERE 
         s.s_id = :s_id`,
      { replacements: { s_id: id } }
    );

    if (!studentData || studentData.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Group the student info and courses into one structure
    const studentInfo = {
      s_id: studentData[0].s_id,
      student_name: studentData[0].student_name,
      roll_no: studentData[0].roll_no,
      sec_id: studentData[0].sec_id,
      student_img: studentData[0].student_img,
      enrolled_courses: studentData.map((course) => ({
        course_id: course.c_id,
        course_name: course.course_name,
        faculty_id: course.f_id,
        faculty_name: course.faculty_name,
        faculty_img: course.faculty_img,
      })),
    };

    return res.status(200).json(studentInfo);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { getStudent };
