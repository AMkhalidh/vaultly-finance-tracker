const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, monthlyBudget: user.monthlyBudget } });
  } catch { res.status(500).json({ message: 'Server error' }); }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, monthlyBudget: user.monthlyBudget } });
  } catch { res.status(500).json({ message: 'Server error' }); }
});
router.put('/budget', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, { monthlyBudget: req.body.monthlyBudget }, { new: true });
    res.json({ monthlyBudget: user.monthlyBudget });
  } catch { res.status(500).json({ message: 'Server error' }); }
});
router.get('/me', auth, async (req, res) => {
  try { const user = await User.findById(req.userId).select('-password'); res.json(user); }
  catch { res.status(500).json({ message: 'Server error' }); }
});
module.exports = router;
