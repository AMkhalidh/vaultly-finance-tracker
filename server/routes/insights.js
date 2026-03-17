const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const now = new Date();
    const thisMonth = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [thisMonthTx, lastMonthTx] = await Promise.all([
      Transaction.find({ user: req.user.id, date: thisMonth }),
      Transaction.find({ user: req.user.id, date: { $gte: lastMonthStart, $lte: lastMonthEnd } })
    ]);

    const insights = [];

    const thisExpenses = thisMonthTx.filter(t => t.type === 'expense');
    const lastExpenses = lastMonthTx.filter(t => t.type === 'expense');
    const thisTotal = thisExpenses.reduce((s, t) => s + t.amount, 0);
    const lastTotal = lastExpenses.reduce((s, t) => s + t.amount, 0);

    if (lastTotal > 0) {
      const diff = ((thisTotal - lastTotal) / lastTotal) * 100;
      if (diff > 10) insights.push({ type: 'warning', icon: '📈', text: `Your spending is up ${Math.round(diff)}% compared to last month.` });
      else if (diff < -10) insights.push({ type: 'positive', icon: '📉', text: `Great job! Your spending is down ${Math.round(Math.abs(diff))}% compared to last month.` });
    }

    const catMap = {};
    thisExpenses.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
    const lastCatMap = {};
    lastExpenses.forEach(t => { lastCatMap[t.category] = (lastCatMap[t.category] || 0) + t.amount; });

    Object.entries(catMap).forEach(([cat, amt]) => {
      if (lastCatMap[cat] && amt > lastCatMap[cat] * 1.5) {
        insights.push({ type: 'warning', icon: '⚠️', text: `Your ${cat} spending is ${Math.round(((amt - lastCatMap[cat]) / lastCatMap[cat]) * 100)}% higher than last month.` });
      }
    });

    const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
    if (topCat) insights.push({ type: 'info', icon: '🏆', text: `Your biggest expense category this month is ${topCat[0]} at $${topCat[1].toFixed(2)}.` });

    const thisIncome = thisMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    if (thisIncome > 0 && thisTotal > 0) {
      const savingsRate = ((thisIncome - thisTotal) / thisIncome) * 100;
      if (savingsRate > 20) insights.push({ type: 'positive', icon: '💰', text: `You're saving ${Math.round(savingsRate)}% of your income this month. Keep it up!` });
      else if (savingsRate < 0) insights.push({ type: 'warning', icon: '🚨', text: `You're spending more than you earn this month. Consider reviewing your expenses.` });
    }

    if (thisExpenses.length > 0) {
      const avgDaily = thisTotal / now.getDate();
      const projected = avgDaily * new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      insights.push({ type: 'info', icon: '🔮', text: `At your current rate, you'll spend around $${projected.toFixed(2)} this month.` });
    }

    if (insights.length === 0) insights.push({ type: 'info', icon: '💡', text: 'Add more transactions to unlock personalised spending insights.' });

    res.json(insights);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
