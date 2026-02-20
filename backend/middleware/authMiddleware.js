const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  let token;

  // 1. Check cookie FIRST (for downloads)
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // 2. Fallback to Authorization header (for axios)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.slice(7);
  }

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized! No token provided!!",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: "INVALID token!!" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};


const requireRole = (roles = []) => {
    if (typeof roles === 'string') roles = [roles];
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({message: "Not authenticated"});
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message: "Forbidden: Insufficient role"})
        }
        next();
    };
};

module.exports = {verifyToken, requireRole};