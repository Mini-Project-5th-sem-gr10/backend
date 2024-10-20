const sequelize = require("../config/connect.js");
function generateAttendanceReport(data) {
  // Initialize the report
  const report = [];

  // Loop through the enrolled courses
  data.enrolled_courses.forEach((course) => {
    const courseId = course.course_id;

    // Filter attendance records for the specific course
    const courseAttendance = data.attendace.filter(
      (att) => att.c_id === courseId
    );

    // Count total classes and present classes
    const totalClasses = courseAttendance.length;
    const presentClasses = courseAttendance.filter(
      (att) => att.isPresent === "1"
    ).length;

    // Add the course report to the final report array
    report.push({
      course_code: courseId,
      total_classes: totalClasses,
      present_classes: presentClasses,
    });
  });

  return report;
}
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

    const [StudentAttendanceData, metadata1] = await sequelize.query(
      `SELECT * FROM attend_db.attendance_102024 where s_id = :s_id;`,
      { replacements: { s_id: id } }
    );
    const attendace = generateAttendanceReport({
      ...studentInfo,
      attendace: StudentAttendanceData,
    });
    return res.status(200).json({ ...studentInfo, attendace: attendace });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const { id, role } = req.user; // Student ID
    const { sec_id, c_id } = req.body; // Section ID and Course ID

    const studentid = role === "faculty" ? req.body.s_id : id;

    // First query: Fetch course details
    const [courseData] = await sequelize.query(
      `SELECT 
        courses.name as course_name,
        courses.c_id as course_id,
        faculty.name as faculty_name
      FROM 
        attend_db.faculty
      INNER JOIN 
        attend_db.teaches ON faculty.f_id = teaches.f_id
      INNER JOIN 
        attend_db.courses ON teaches.c_id = courses.c_id
      WHERE 
        courses.c_id = '${c_id}';`
    );
    const [student_name] = await sequelize.query(`
      SELECT name FROM students WHERE students.s_id = '${studentid}'
      `);

    // Second query: Fetch attendance details for the student
    const [attendanceData] = await sequelize.query(
      `SELECT 
        date, start, classroom, isPresent
      FROM 
        attend_db.attendance_102024
      WHERE 
        s_id = '${studentid}'
        AND sec_id = '${sec_id}'
        AND c_id = '${c_id}';`
    );

    // Send the result as a response
    return res.status(200).json({
      courseData: courseData[0],
      attendance: attendanceData,
      student_name: student_name[0].name,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { getStudent, getStudentAttendance };
