# Node.js API Backend

## Overview

This repository provides the backend API for a face recognition-based attendance management system. Built with Node.js and Express.js, it handles user authentication, attendance tracking, and data analytics, utilizing MySQL for storage. The API supports student and faculty management with endpoints for login, attendance marking, and student data retrieval.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
  - [Authentication Routes](#authentication-routes)
  - [Student Routes](#student-routes)
  - [Attendance Routes](#attendance-routes)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Mini-Project-5th-sem-gr10/backend.git
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=your_db_port
PORT=5000
JWT_SECRET=your_jwt_secret
```

### 4. Start the Server

```bash
npm start
```

The API will be available at `http://localhost:5000`.

---

## API Routes

### Authentication Routes

#### 1. Login

- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Description:** Allows users to log in using their ID and password.
- **Request Body:**
  ```json
  {
    "id": "2024122043",
    "password": "your_password"
  }
  ```
- **Response:** Returns a JWT token if login is successful.

#### 2. Get User Info

- **Endpoint:** `/auth/getUser`
- **Method:** `GET`
- **Description:** Retrieves basic information about the logged-in user.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:** Returns user details including ID, name, image source, and role.

### Student Routes

#### 1. Get Student Data

- **Endpoint:** `/getStudent`
- **Method:** `GET`
- **Description:** Fetches a student's details, including enrolled courses and faculty information.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:** Student and course information.

#### 2. Get Student Attendance

- **Endpoint:** `/getStudentAttendance`
- **Method:** `POST`
- **Description:** Retrieves the attendance record for the student.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "s_id": "2024122043",
    "c_id": "CAT301"
  }
  ```
- **Response:** Detailed attendance report for the requested course.

### Attendance Routes

#### 1. Mark Attendance

- **Endpoint:** `/attendance/mark`
- **Method:** `POST`
- **Description:** Marks attendance by processing uploaded images, identifying students, and recording attendance.
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Request Body:**
  - **Form Data:** `images` (Array of JPEG/PNG images)
  - **JSON Data:**
    ```json
    {
      "f_id": "20100001",
      "sec_id": "AIML_S5B",
      "c_id": "CAT301",
      "classroom": "DT412",
      "date": "2024-10-01",
      "start": "10:00:00",
      "duration": "1"
    }
    ```
- **Response:** Confirms attendance marking and provides counts of present and absent students.

#### 2. Edit Attendance

- **Endpoint:** `/attendance/edit`
- **Method:** `PUT`
- **Description:** Edits attendance records for a specified session.
- **Request Body:**
  ```json
  {
    "s_id": "2024122001",
    "f_id": "20100001",
    "sec_id": "AIML_S5B",
    "c_id": "CAT301",
    "date": "2024-10-01",
    "start": "10:00:00",
    "isPresent": 1
  }
  ```
- **Response:** Confirms if attendance update was successful.

---

## Error Handling

Each route includes comprehensive error handling for:

- Missing required fields.
- Invalid file types or sizes for image uploads.
- Record conflicts (e.g., duplicate attendance entries).
- Unauthorized access due to missing or invalid tokens.

## Contributing

Contributions are welcome! If you have suggestions for improvements, feature requests, or discover any bugs, please feel free to open an issue. We also welcome pull requests for any enhancements or fixes.

## License

This project is licensed under the Apache License. For more details, refer to the [LICENSE](LICENSE) file.

---
