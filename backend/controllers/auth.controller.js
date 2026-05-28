const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { getMockUsers, mockComparePassword } = require('../utils/mockData');

const SECRET = process.env.JWT_SECRET || 'supersecretkey_angular_app_2024';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, userId: user.userId, role: user.role, name: user.name },
    SECRET,
    { expiresIn: '24h' }
  );
};

// Login
exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password)
      return res.status(400).json({ message: 'User ID and password are required' });

    let user;
    let isMatch = false;

    try {
      user = await User.findOne({ userId });
      if (user) isMatch = await user.comparePassword(password);
    } catch {
      // Fallback to mock
      const mockUsers = getMockUsers();
      user = mockUsers.find((u) => u.userId === userId);
      if (user) isMatch = mockComparePassword(password, user.password);
    }

    if (!user || !isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    if (user.isActive === false)
      return res.status(403).json({ message: 'Account is inactive' });

    // Update last login
    try {
      await User.findOneAndUpdate({ userId }, { lastLogin: new Date() });
    } catch {}

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toJSON ? user.toJSON() : user;

    res.json({ message: 'Login successful', token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    let user;
    try {
      user = await User.findById(req.user.id).select('-password');
    } catch {
      const mockUsers = getMockUsers();
      user = mockUsers.find((u) => u.userId === req.user.userId);
      if (user) { const { password, ...rest } = user; user = rest; }
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch profile', error: err.message });
  }
};
