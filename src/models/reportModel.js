const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({

  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  filters: {
    startDate: Date,
    endDate: Date,
    categories: [String],
    tags: [String]
  },
  data: {
    totalIncome: Number,
    totalExpenses: Number,
    netSavings: Number,
    expensesByCategory: { type: Map, of: Number },
    expensesByTag: { type: Map, of: Number }
  },
  generatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Report', reportSchema);