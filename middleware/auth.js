const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Get the token from the headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or malformed" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the decoded data (user ID, role) to the req object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    // Call next middleware
    next();
  } catch (error) {
    // Handle invalid token
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = auth;
