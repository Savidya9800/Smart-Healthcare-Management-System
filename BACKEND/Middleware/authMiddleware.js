const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Extract token after 'Bearer'

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Debugging line 
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message); // Debugging line 
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
