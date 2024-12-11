import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;  // Use environment variables in production

const authenticateJWT = (req, res, next) => {
  const excludedRoutes = ['/api/login','/admin/login','/admin/create','/save-admin-token','/send-admin-notification','/save-user-token','/send-user-notification']; // Define routes to exclude from authentication

  if (excludedRoutes.includes(req.path)) {
    return next(); // Skip authentication for excluded routes
  }

  const token = req.header('Authorization')?.split(' ')[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = user; // Attach decoded user data to request
    next();
  });
};

export default authenticateJWT;
