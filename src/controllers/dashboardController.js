const Transaction = require('../models/transactionModel');
const Budget = require('../models/budgetModel');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');

exports.getUserDashboard = async (req, res, next) => {
  try {

    const userId = req.user.userId;
            
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const transactions = await Transaction.find({ userId: userId }).limit(5);
    const budgets = await Budget.find({ userId: userId });
    const goals = await Goal.find({ userId: userId });
    res.json({ transactions, budgets, goals });

  } catch (error) {

    res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAdminDashboard = async (req, res) => {
  try {

    const usersCount = await User.countDocuments({ role: 'user' });
    const transactionCount = await Transaction.countDocuments();
    const budgetsCount = await Budget.countDocuments();
    const goalsCount = await Goal.countDocuments();
    const transactions = await Transaction.find();
    const budgets = await Budget.find();
    const goals = await Goal.find();

    res.json({
      Users: usersCount,
      Transactions: transactionCount,
      Budgets: budgetsCount,
      Goals: goalsCount,
      transactionsData: transactions,
      budgets,
      goals,
    });

  } catch (error) {
    
    res.status(500).json({ error: 'Internal server error' });
    }
};