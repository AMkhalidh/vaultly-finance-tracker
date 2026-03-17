const express = require('express');
const auth = require('../middleware/auth');
const SavingsGoal = require('../models/SavingsGoal');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try { res.json(await SavingsGoal.find({ user: req.user.id }).sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const goal = await SavingsGoal.create({ ...req.body, user: req.user.id });
    res.status(201).json(goal);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json(goal);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
