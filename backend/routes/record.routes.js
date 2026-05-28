const express = require('express');
const router = express.Router();
const {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/record.controller');
const { protect, adminOnly, simulateDelay } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', simulateDelay, getRecords);
router.post('/', adminOnly, createRecord);
router.get('/:id', simulateDelay, getRecordById);
router.put('/:id', adminOnly, updateRecord);
router.delete('/:id', adminOnly, deleteRecord);

module.exports = router;
