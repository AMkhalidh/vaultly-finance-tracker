require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'https://vaultly-finance-tracker.vercel.app', 'https://vaultly-finance-tracker-d3t1b2van-amkhalidhs-projects.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/password', require('./routes/passwordReset'));
app.use('/api/goals', require('./routes/savingsGoals'));
app.use('/api/recurring', require('./routes/recurring'));
app.use('/api/insights', require('./routes/insights'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('✅ MongoDB connected'); app.listen(PORT, () => console.log('✅ Server running on port ' + PORT)); })
  .catch(err => console.error('❌ MongoDB error:', err));
