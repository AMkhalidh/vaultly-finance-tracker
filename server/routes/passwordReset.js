const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const router = express.Router();

router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    const token = crypto.randomBytes(32).toString('hex');
    await PasswordReset.deleteMany({ email });
    await PasswordReset.create({ email, token, expiresAt: new Date(Date.now() + 3600000) });
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    console.log(`\n🔑 PASSWORD RESET LINK for ${email}:\n${resetLink}\n`);
    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/reset', async (req, res) => {
  try {
    const { token, password } = req.body;
    const record = await PasswordReset.findOne({ token, expiresAt: { $gt: new Date() } });
    if (!record) return res.status(400).json({ message: 'Invalid or expired reset link.' });
    const user = await User.findOne({ email: record.email });
    if (!user) return res.status(400).json({ message: 'User not found.' });
    const bcrypt = require('bcryptjs');
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await PasswordReset.deleteMany({ email: record.email });
    res.json({ message: 'Password reset successfully.' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
