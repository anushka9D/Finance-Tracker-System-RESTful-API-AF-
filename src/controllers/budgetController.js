const Budget = require('../models/budgetModel');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');
const Notification = require('../models/notificationModel');

exports.createBudget = async (req, res) => {
  try {
      const { category, currency, period } = req.body;
      const userId = req.user.userId;
      let currentSpending = 0;
      let income = 0;
            
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const transactions = await Transaction.find({userId: userId});

      transactions.forEach((transaction) => {
          if (transaction.type === 'expense') {
              currentSpending += transaction.amount;
          } else if (transaction.type === 'income') {
              income += transaction.amount;
          }
      });

      const budget = new Budget({ userId, category, amount: income, currency, period,currentSpending });

      await budget.save();

      res.status(201).json({ message: 'Budget created successfully' });

  } catch (error) {
      console.error('Error in create budget:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getBudgets = async (req, res) => {
  try {
    const userId = req.user.userId; 
            
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

    const budgets = await Budget.find({ userId: userId });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    }
};

exports.checkBudgetStatus = async (req, res) => {
  try {

    const userId = req.user.userId; 
            
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const budgets = await Budget.find({ userId: userId });

      const budgetStatus = budgets.map(budget => {
        
        const remainingAmount = budget.amount - budget.currentSpending;
        let status = "within budget";
    
        if (budget.currentSpending > budget.amount) {
          status = "over budget";
        } else if (remainingAmount <= 0.1 * budget.amount) {
          status = "nearing budget";
        }
    
        return {
          category: budget.category,
          totalBudget: budget.amount,
          currentSpending: budget.currentSpending,
          remainingAmount,
          status,
        };
      });
    
      res.status(200).json(budgetStatus);
    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getSpendingRecommendations = async (req, res) => {
  try {

    const userId = req.user.userId; 
            
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const budgets = await Budget.find({ userId: userId });

    const recommendations = budgets.map(budget => {

      const totalSpent = budget.currentSpending;
      const remainingBudget = budget.amount - totalSpent;
      let recommendation = "Good job!";
  
      if (remainingBudget < 0.1 * budget.amount) {
        recommendation = "Consider reducing spending in this category.";
      }
  
      return {
        category: budget.category,
        currentSpending: totalSpent,
        remainingBudget,
        recommendation,
      };
    });
  
    res.status(200).json(recommendations);
    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    }
};


// nodemailer 
const transporter = nodemailer.createTransport({

  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: 'kalumgamage001@gmail.com', // our email
    pass: 'oitvqqryudozpwaw',  // our email-password 
  },
});

exports.notifyBudgetExceeded = async (req, res) => {
  try {

    const userId = req.user.userId; 
            
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const budgets = await Budget.find({ userId: userId });

    const notifications = budgets.filter(budget => budget.currentSpending > budget.amount);
  
  if (notifications.length > 0) {
    
    const mailOptions = {
      from: 'kalumgamage001@gmail.com', // Our email address
      to: user.username, // The user email address
      subject: `Budget Exceeded for ${budgets.map(b => b.category)}`,
      text: `Hello ${user.username},\n\nYou have exceeded your budget for the ${budgets.map(b => b.category)} category. Please review your spending.\n\nBest regards,\n Finance Tracker App Team`
    };

    await transporter.sendMail(mailOptions)
      .then(() => {
        console.log(`Email sent to ${user.email}`);
      })
      .catch((error) => {
        console.error(`Error sending email: ${error.message}`);
      });
    

    const notification = new Notification({
      userId: userId,
      message: `You have exceeded your budget.`,
    });
    await notification.save();

    return res.status(200).json({ message: "Notification sent for exceeded budgets.", budgets: notifications });
  } 

  res.status(200).send({message: 'No exceeded budgets to notify.'});
    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    }
};


cron.schedule('0 0 * * *', async () => {  // Runs daily at midnight
  try {
    const users = await User.find(); 

    for (const user of users) {
      const budgets = await Budget.find({ userId: user._id });

      for (const budget of budgets) {
        if (budget.currentSpending >= budget.amount) {
          console.log(`User ${user.username} has exceeded their ${budget.category} budget.`);
          
          const notification = new Notification({
            userId: user._id,
            message: `You have exceeded your budget for ${budget.category}.`,
          });
          await notification.save();
          
          // Prepare email message
          const mailOptions = {
            from: 'kalumgamage001@gmail.com', // Our email address
            to: user.username, // The user email address
            subject: `Budget Exceeded for ${budgets.map(b => b.category)}`,
            text: `Hello ${user.username},\n\nYou have exceeded your budget for the ${budgets.map(b => b.category)} category. Please review your spending.\n\nBest regards,\n Finance Tracker App Team`
          };

          await transporter.sendMail(mailOptions)
            .then(() => {
              console.log(`Email sent to ${user.email}`);
            })
            .catch((error) => {
              console.error(`Error sending email: ${error.message}`);
            });
        }
      }
    }
  } catch (error) {
    console.error('Error in cron job for budget check:', error);
  }
});