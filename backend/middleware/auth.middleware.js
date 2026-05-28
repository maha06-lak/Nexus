const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey_angular_app_2024');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') return next();
  return res.status(403).json({ message: 'Forbidden: Admins only' });
};

// Simulate delay middleware (accepts ?delay=ms query param)
const simulateDelay = (req, res, next) => {
  const delay = parseInt(req.query.delay) || 0;
  const maxDelay = 10000; // max 10 seconds
  const safeDelay = Math.min(delay, maxDelay);
  if (safeDelay > 0) {
    setTimeout(next, safeDelay);
  } else {
    next();
  }
};

module.exports = { protect, adminOnly, simulateDelay };
