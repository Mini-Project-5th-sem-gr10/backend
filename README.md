# Node.js API Backend

## About

This repository houses the Node.js/Express.js API server, providing a RESTful interface for frontend-backend communication. It manages user authentication, attendance tracking, and data analytics, utilizing a MySQL Database.

This backend serves as a foundational API for managing student data, course enrollments, and authentication processes, designed to integrate with a frontend application. The project is continuously growing, with new routes and features added regularly.

## Setup Instructions

### 1. Clone the Repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/Mini-Project-5th-sem-gr10/backend.git
```

### 2. Install Dependencies

Navigate to the project directory and install all necessary packages using npm:

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Ensure you have a `.env` file to configure database credentials and other environment-specific settings.

```bash
DB_NAME=  enter your database name
DB_USER=  enter your database username
DB_PASSWORD=  enter your database password
DB_HOST= enter your  database host
DB_PORT= enter your  database port
DB_DIALECT=  enter your database dialect
PORT= port number
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Start the Server

Run the following command to start the development server:

```bash
npm start
```

The API will be available on `http://localhost:<PORT>`.

## Routes Documentation

### Authentication Routes

#### 1. Login Route

**Endpoint:** `/auth/login`

**Method:** `POST`

**Description:** This route allows a student to log in using their student ID (`s_id`) and password.

**Request Body:**

```json
{
  "s_id": "2024122043",
  "password": "your_password"
}
```

**Sample Response:**

```json
{
  "message": "Logged In Successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Headers:**

- No special headers required for this request.

#### 2. Get Student Data Route

**Endpoint:** `/getStudent`

**Method:** `GET`

**Description:** Fetches detailed information about a student, including enrolled courses and faculty data.

**Authorization:** Requires a Bearer Token in the `Authorization` header.

**Headers:**

- `Authorization: Bearer <token>`

**Sample Request Header:**

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Sample Response:**

```json
{
  "s_id": 2024122043,
  "student_name": "Prakhar Sanjeev Pande",
  "roll_no": 43,
  "sec_id": "AIML_S5B",
  "student_img": "",
  "enrolled_courses": [
    {
      "course_id": "CAP304",
      "course_name": "Compiler Design Lab (CD Lab)",
      "faculty_id": "20100004",
      "faculty_name": "Dr. A. Agrawal",
      "faculty_img": null
    },
    {
      "course_id": "CAT304",
      "course_name": "Compiler Design (CD)",
      "faculty_id": "20100004",
      "faculty_name": "Dr. A. Agrawal",
      "faculty_img": null
    }
    // more enrolled courses...
  ]
}
```
