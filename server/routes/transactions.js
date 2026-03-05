const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();
router.get('/', auth, async (req, res) => {
  try {
    const { month, year, type, category } = req.query;
    const filter = { user: req.userId };
    if (month && year) filter.date = { $gte: new Date(year, month-1, 1), $lte: new Date(year, month, 0, 23, 59, 59) };
    if (type) filter.type = type;
    if (category) filter.category = category;
    res.json(await Transaction.find(filter).sort({ date: -1 }));
  } catch { res.status(500).json({ message: 'Server error' }); }
});
router.get('/summary', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { user: req.userId };
    if (month && year) filter.date = { $gte: new Date(year, month-1, 1), $lte: new Date(year, month, 0, 23, 59, 59) };
    const txs = await Transaction.find(filter);
    const income = txs.filter(t => t.type==='income').reduce((s,t) => s+t.amount, 0);
    const expenses = txs.filter(t => t.type==='expense').reduce((s,t) => s+t.amount, 0);
    const categoryBreakdown = {};
    txs.filter(t => t.type==='expense').forEach(t => { categoryBreakdown[t.category] = (categoryBreakdown[t.category]||0) + t.amount; });
    res.json({ income, expenses, balance: income-expenses, categoryBreakdown });
  } catch { res.status(500).json({ message: 'Server error' }); }
});
router.get('/trend', auth, async (req, res) => {
  try {
    const months = [];
    for (let i=5; i>=0; i--) { const d = new Date(); d.setMonth(d.getMonth()-i); months.push({ month: d.getMonth()+1, year: d.getFullYear() }); }
    const trend = await Promise.all(months.map(async ({ month, year }) => {
      const start = new Date(year, month-1, 1), end = new Date(year, month, 0, 23, 59, 59);
      const txs = await Transaction.find({ user: req.userId, date: { $gte: start, $lte: end } });
      return { month, year, income: txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0), expenses: txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0), label: start.toLocaleString('default',{month:'short'}) };
    }));
    res.json(trend);
  } catch { res.status(500).json({ message: 'Server error' }); }
});
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    if (!type||!amount||!category) return res.status(400).json({ message: 'type, amount and category required' });
    res.status(201).json(await Transaction.create({ user: req.userId, type, amount: parseFloat(amount), category, description, date: date||new Date() }));
  } catch { res.status(500).json({ message: 'Server error' }); }
});
router.delete('/:id', auth, async (req, res) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, user: req.userId });
    if (!tx) return res.status(404).json({ message: 'Not found' });
    await tx.deleteOne(); res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});
router.put('/:id', auth, async (req, res) => {
  try {
    const tx = await Transaction.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true });
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json(tx);
  } catch { res.status(500).json({ message: 'Server error' }); }
});
module.exports = router;
