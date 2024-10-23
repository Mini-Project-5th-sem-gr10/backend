const sequelize = require("../config/connect.js");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

// Multer setup to store uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper functions
const convertToIds = (arr) => arr.map((student) => student.s_id);
const extractIds = (list) => list.map((item) => item.split("$")[1].trim());
const generateAttendance = (idsOfAllStudents, idsOfPresentStudents) => {
  return idsOfAllStudents.map((s_id) => ({
    s_id,
    isPresent: idsOfPresentStudents.includes(JSON.stringify(s_id)) ? 1 : 0,
  }));
};

// Controller function for marking attendance
const markAttendance = async (req, res) => {
  try {
    const { f_id, sec_id, c_id, classroom, date, start, duration } = req.body;

    // Security: Check for required fields
    if (
      !f_id ||
      !sec_id ||
      !c_id ||
      !classroom ||
      !date ||
      !start ||
      !duration
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Security: File validation (MIME type & size check)
    const validMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (req.files.some((file) => !validMimeTypes.includes(file.mimetype))) {
      return res
        .status(400)
        .json({ message: "Invalid file type. Only JPEG and PNG are allowed." });
    }

    if (req.files.some((file) => file.size > 50 * 1024 * 1024)) {
      // Limit to 50MB
      return res
        .status(400)
        .json({ message: "File too large. Maximum file size is 5MB." });
    }

    // Check if the attendance record already exists
    const [existingRecord] = await sequelize.query(`
      SELECT * FROM attendance_102024 
      WHERE f_id = '${f_id}' 
      AND sec_id = '${sec_id}' 
      AND c_id = '${c_id}' 
      AND classroom = '${classroom}' 
      AND date = '${date}' 
      AND start = '${start}' 
      AND duration = ${duration};
    `);

    if (existingRecord.length > 0) {
      return res
        .status(409)
        .json({ message: "Attendance record already exists." });
    }

    // Fetch all students
    const [studentList] = await sequelize.query(
      `SELECT s_id FROM students WHERE sec_id = '${sec_id}';`
    );
    const idsOfAllStudents = convertToIds(studentList);

    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    const files = req.files; // Array of images received
    const recognizedFacesSet = new Set(); // To store unique recognized faces

    // Process each image and send to the ML API
    await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file.buffer, file.originalname);

        try {
          const response = await axios.post(
            "http://localhost:8000/predict/",
            formData,
            { headers: formData.getHeaders() }
          );
          response.data.recognized_faces.forEach((face) =>
            recognizedFacesSet.add(face)
          );
        } catch (err) {
          console.error(
            `Error processing file ${file.originalname}:`,
            err.message
          );
        }
      })
    );

    // Convert recognized faces to array
    const uniqueRecognizedFaces = Array.from(recognizedFacesSet);
    console.log(uniqueRecognizedFaces);

    const idsOfPresentStudents = extractIds(uniqueRecognizedFaces);

    // Generate attendance records
    const attendanceRecords = generateAttendance(
      idsOfAllStudents,
      idsOfPresentStudents
    );

    // Batch insert attendance records
    const insertQuery = `
      INSERT INTO attendance_102024 
      (s_id, f_id, sec_id, c_id, isPresent, classroom, date, start, duration) 
      VALUES ${attendanceRecords
        .map(
          (record) =>
            `('${record.s_id}', '${f_id}', '${sec_id}', '${c_id}', '${record.isPresent}', '${classroom}', '${date}', '${start}', ${duration})`
        )
        .join(", ")}`;

    await sequelize.query(insertQuery);

    // Count present and absent students
    const presentCount = idsOfPresentStudents.length;
    const absentCount = idsOfAllStudents.length - presentCount;

    // Send success response with present and absent count
    return res.status(200).json({
      message: "Successfully Marked Attendance",
      presentCount,
      absentCount,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const editAttendance = async (req, res) => {
  try {
    const { isPresent, s_id, f_id, sec_id, c_id, data, start } = req.body;

    await sequelize.query(`
      UPDATE attendance_102024 SET 'isPresent' = '0' WHERE ('s_id' = '2024122001') and ('f_id' = '20100001') and ('sec_id' = 'AIML_S5B') and ('c_id' = 'CAT301') and ('isPresent' = '1') and ('classroom' = 'DT412') and ('date' = '2024-10-01') and ('start' ='10:00:00') d ('duration' = '1');

      `);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Export the controller and multer middleware
module.exports = { markAttendance, upload, editAttendance };
