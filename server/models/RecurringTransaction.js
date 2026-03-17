const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], required: true },
  nextDue: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('RecurringTransaction', schema);
