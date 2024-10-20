const sequelize = require("../config/connect.js");

const getTeacher = async (req, res) => {
  try {
    const { id } = req.user;

    // Parameterized query to avoid SQL injection
    const facultyData = await sequelize.query(
      `
      SELECT 
        f.f_id,
        f.name AS faculty_name,
        f.img_src AS faculty_img,
        t.c_id,
        t.sec_id,
        c.name AS course_name
      FROM 
        faculty f
      JOIN teaches t ON t.f_id = f.f_id
      JOIN courses c ON c.c_id = t.c_id
      WHERE 
        f.f_id = :id;
      `,
      {
        replacements: { id }, // Use replacements for safe query execution
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!facultyData.length) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Structuring the faculty info and courses taught
    const facultyInfo = {
      f_id: facultyData[0].f_id,
      faculty_name: facultyData[0].faculty_name,
      faculty_img: facultyData[0].faculty_img,
      courses_taught: facultyData.map((course) => ({
        course_id: course.c_id,
        course_name: course.course_name,
        sec_id: course.sec_id, // Changed faculty_id to sec_id since sec_id is used in the query
      })),
    };

    return res.status(200).json(facultyInfo);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getStudentList = async (req, res) => {
  try {
    const { sec_id } = req.body;
    const StudentList = await sequelize.query(`
      SELECT roll_no, name , s_id as id , img_src  FROM attend_db.students where sec_id='${sec_id}';
      `);

    if (!StudentList.length) {
      return res.status(404).json({ message: "No Students found" });
    }

    return res.status(200).json(StudentList[0]);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { getTeacher, getStudentList };
