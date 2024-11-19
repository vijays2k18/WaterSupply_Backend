import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;  // Use environment variables in production

// Middleware to authenticate using JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = user; // Attach the decoded user data to the request object
    next();
  });
};

export default authenticateJWT;
