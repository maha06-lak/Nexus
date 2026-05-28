const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { getMockUsers } = require('../utils/mockData');

// GET all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    let users;
    try {
      users = await User.find().select('-password').sort({ createdAt: -1 });
    } catch {
      users = getMockUsers().map(({ password, ...u }) => u);
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch users', error: err.message });
  }
};

// GET single user
exports.getUserById = async (req, res) => {
  try {
    let user;
    try {
      user = await User.findById(req.params.id).select('-password');
    } catch {
      user = getMockUsers().find((u) => u.id === req.params.id);
      if (user) { const { password, ...rest } = user; user = rest; }
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

// CREATE user (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { userId, name, email, password, role, department } = req.body;
    const exists = await User.findOne({ $or: [{ userId }, { email }] });
    if (exists) return res.status(409).json({ message: 'User ID or email already exists' });
    const user = await User.create({ userId, name, email, password, role, department });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ message: 'Could not create user', error: err.message });
  }
};

// UPDATE user (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, department, isActive, password } = req.body;
    const updateData = { name, email, role, department, isActive };
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Could not update user', error: err.message });
  }
};

// DELETE user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete user', error: err.message });
  }
};

// TOGGLE active status (Admin only)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) {
    res.status(500).json({ message: 'Could not toggle status', error: err.message });
  }
};
