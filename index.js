const express = require("express");
const dotenv = require("dotenv");
const StudentRouter = require("./routes/StudentsRoutes");
const AuthRouter = require("./routes/AuthRoutes");

dotenv.config();

const app = express();

app.use(express.json());

app.use(StudentRouter);
app.use(AuthRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
