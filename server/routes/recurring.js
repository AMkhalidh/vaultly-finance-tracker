const express = require('express');
const auth = require('../middleware/auth');
const RecurringTransaction = require('../models/RecurringTransaction');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try { res.json(await RecurringTransaction.find({ user: req.user.id }).sort({ nextDue: 1 })); }
  catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const tx = await RecurringTransaction.create({ ...req.body, user: req.user.id });
    res.status(201).json(tx);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const tx = await RecurringTransaction.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true });
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json(tx);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await RecurringTransaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
