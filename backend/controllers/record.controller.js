const Record = require('../models/record.model');
const { getMockRecords } = require('../utils/mockData');

// GET records - filters by role
exports.getRecords = async (req, res) => {
  try {
    const { role } = req.user;
    const filter = role === 'Admin' ? {} : { accessLevel: 'all' };

    let records;
    try {
      records = await Record.find(filter).sort({ createdAt: -1 });
    } catch {
      records = getMockRecords().filter(
        (r) => role === 'Admin' || r.accessLevel === 'all'
      );
    }
    res.json({ records, total: records.length, role });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch records', error: err.message });
  }
};

// GET single record
exports.getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    if (record.accessLevel === 'admin' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

// CREATE record (Admin only)
exports.createRecord = async (req, res) => {
  try {
    const record = await Record.create({ ...req.body, createdBy: req.user.userId });
    res.status(201).json({ message: 'Record created', record });
  } catch (err) {
    res.status(500).json({ message: 'Could not create record', error: err.message });
  }
};

// UPDATE record (Admin only)
exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record updated', record });
  } catch (err) {
    res.status(500).json({ message: 'Could not update record', error: err.message });
  }
};

// DELETE record (Admin only)
exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete record', error: err.message });
  }
};
