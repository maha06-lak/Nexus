const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Finance', 'HR', 'Operations', 'IT', 'Marketing', 'Sales'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    assignedTo: { type: String }, // userId
    createdBy: { type: String }, // userId
    description: { type: String },
    amount: { type: Number, default: 0 },
    dueDate: { type: Date },
    tags: [{ type: String }],
    // Access level: 'all' visible to everyone, 'admin' only for admins
    accessLevel: { type: String, enum: ['all', 'admin'], default: 'all' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Record', recordSchema);
