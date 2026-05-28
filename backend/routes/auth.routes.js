const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/auth.controller');
const { protect, simulateDelay } = require('../middleware/auth.middleware');

router.post('/login', simulateDelay, login);
router.get('/profile', protect, simulateDelay, getProfile);

module.exports = router;
