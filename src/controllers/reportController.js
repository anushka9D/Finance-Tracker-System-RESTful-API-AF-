const cron = require('node-cron');
const Report = require('../models/reportModel');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

function processTransactions(transactions) {
  let totalIncome = 0;
  let totalExpenses = 0;
  const expensesByCategory = {};
  const expensesByTag = {};

  transactions.forEach(tx => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else if (tx.type === 'expense') {
      totalExpenses += tx.amount;
      expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
      tx.tags.forEach(tag => {
        expensesByTag[tag] = (expensesByTag[tag] || 0) + tx.amount;
      });
    }
  });

  const netSavings = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    expensesByCategory,
    expensesByTag
  };
}

// Generate monthly reports for all users 
// The task to run on the 1 day of every month at 1:00 AM
cron.schedule('0 1 1 * *', async () => {
  try {

    const users = await User.find({});
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0);

    for (const user of users) {
      const transactions = await Transaction.find({
        userId: user._id,
        date: { $gte: startDate, $lte: endDate }
      });
      const reportData = processTransactions(transactions);


      const report = new Report({
        userId: user._id,
        generatedAt: now,
        filters: {
          startDate,
          endDate,
          categories: [], 
          tags: [] 
        },
        data: reportData
      });
      await report.save();
    }

    res.status(200).json('Monthly reports generated successfully');

  } catch (error) {
    res.status(500).json({ error: 'Error generating monthly reports' });
    }
});


exports.getReports = async (req, res) => {
  try {

    const userId = req.user.userId;
                    
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

    const reports = await Report.find();

    if (reports.length === 0) {
      return res.status(404).json({ error: 'Reports Not found' });
  }

    res.status(200).json(reports);

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getReportById = async (req, res) => {
  try {

    const userId = req.user.userId;
                    
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }


    const report = await Report.findOne({userId: userId});

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    }
};