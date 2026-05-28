require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const recordRoutes = require('./routes/record.routes');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), mode: 'mock' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Nexus API running on http://localhost:${PORT} (mock mode)`));

// Try to connect MongoDB in background (non-blocking)
const mongoose = require('mongoose');
const { seedDatabase } = require('./utils/seed');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/angular_app';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 3000 })
  .then(async () => { console.log('✅ MongoDB connected'); await seedDatabase(); })
  .catch(() => console.log('📝 MongoDB unavailable — running in mock data mode'));

module.exports = app;
