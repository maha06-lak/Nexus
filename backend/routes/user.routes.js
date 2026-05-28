const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require('../controllers/user.controller');
const { protect, adminOnly, simulateDelay } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', adminOnly, simulateDelay, getAllUsers);
router.post('/', adminOnly, createUser);
router.get('/:id', simulateDelay, getUserById);
router.put('/:id', adminOnly, updateUser);
router.delete('/:id', adminOnly, deleteUser);
router.patch('/:id/toggle-status', adminOnly, toggleUserStatus);

module.exports = router;
