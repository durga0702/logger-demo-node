import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticateToken = (expectedRole) => (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userRole = decoded.role;
    if (userRole !== expectedRole) {
      return res
        .status(403)
        .json({ error: `Forbidden. Only ${expectedRole}s can access` });
    }
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const authTokenForAdmin = authenticateToken("Administrator");
export const authTokenForTeacher = authenticateToken("Teacher");
export const authTokenForStudent = authenticateToken("Student");
export const authTokenForParent = authenticateToken("Parent");
