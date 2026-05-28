const User = require('../models/user.model');
const Record = require('../models/record.model');

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        { userId: 'admin01', name: 'Alex Morrison', email: 'alex.morrison@nexus.com', password: 'admin123', role: 'Admin', department: 'Management' },
        { userId: 'user01', name: 'Priya Sharma', email: 'priya.sharma@nexus.com', password: 'user123', role: 'General User', department: 'Finance' },
        { userId: 'user02', name: 'Jordan Lee', email: 'jordan.lee@nexus.com', password: 'user123', role: 'General User', department: 'HR' },
        { userId: 'user03', name: 'Sam Chen', email: 'sam.chen@nexus.com', password: 'user123', role: 'General User', department: 'IT', isActive: false },
      ]);
      console.log('✅ Users seeded');
    }

    const recordCount = await Record.countDocuments();
    if (recordCount === 0) {
      await Record.create([
        { title: 'Q1 Budget Review', category: 'Finance', status: 'Completed', priority: 'High', accessLevel: 'all', assignedTo: 'user01', createdBy: 'admin01', description: 'Quarterly budget analysis and review.', amount: 150000, dueDate: new Date('2024-03-31'), tags: ['budget', 'quarterly'] },
        { title: 'Server Infrastructure Upgrade', category: 'IT', status: 'In Progress', priority: 'Critical', accessLevel: 'all', assignedTo: 'user03', createdBy: 'admin01', description: 'Upgrade primary data center servers.', amount: 75000, dueDate: new Date('2024-06-30'), tags: ['infrastructure', 'upgrade'] },
        { title: 'Employee Onboarding Program', category: 'HR', status: 'In Progress', priority: 'Medium', accessLevel: 'all', assignedTo: 'user02', createdBy: 'user02', description: 'New structured onboarding for 2024 hires.', amount: 12000, dueDate: new Date('2024-04-15') },
        { title: 'Annual Salary Revision Report', category: 'HR', status: 'Pending', priority: 'High', accessLevel: 'admin', assignedTo: 'admin01', createdBy: 'admin01', description: 'Confidential salary revision details.', amount: 2400000, dueDate: new Date('2024-05-01'), tags: ['salary', 'confidential'] },
        { title: 'Marketing Campaign - Product Launch', category: 'Marketing', status: 'Pending', priority: 'High', accessLevel: 'all', assignedTo: 'user01', createdBy: 'user01', description: 'Launch campaign for new product line.', amount: 50000, dueDate: new Date('2024-07-01') },
        { title: 'Revenue Forecast Q2-Q4', category: 'Finance', status: 'In Progress', priority: 'Critical', accessLevel: 'admin', assignedTo: 'admin01', createdBy: 'admin01', description: 'Executive-level revenue projections.', amount: 5000000, dueDate: new Date('2024-04-30'), tags: ['forecast', 'confidential'] },
        { title: 'Cloud Migration Phase 1', category: 'IT', status: 'Pending', priority: 'High', accessLevel: 'all', assignedTo: 'user03', createdBy: 'admin01', description: 'Migrate legacy apps to AWS.', amount: 200000, dueDate: new Date('2024-08-31') },
        { title: 'Sales Pipeline - Enterprise', category: 'Sales', status: 'In Progress', priority: 'Medium', accessLevel: 'all', assignedTo: 'user01', createdBy: 'user01', description: 'Enterprise sales opportunities Q2.', amount: 800000, dueDate: new Date('2024-06-30') },
        { title: 'Vendor Contract Negotiations', category: 'Operations', status: 'Pending', priority: 'Medium', accessLevel: 'admin', assignedTo: 'admin01', createdBy: 'admin01', description: 'Confidential vendor pricing negotiations.', amount: 300000, dueDate: new Date('2024-05-15') },
        { title: 'Team Training & Development', category: 'HR', status: 'Completed', priority: 'Low', accessLevel: 'all', assignedTo: 'user02', createdBy: 'user02', description: 'Annual training sessions for all depts.', amount: 25000, dueDate: new Date('2024-03-31') },
      ]);
      console.log('✅ Records seeded');
    }
  } catch (err) {
    console.log('⚠️  Seed skipped:', err.message);
  }
};

module.exports = { seedDatabase };
