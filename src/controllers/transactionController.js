const Transaction = require('../models/transactionModel')
const User = require('../models/userModel');
const Budget = require('../models/budgetModel');

// Controller for creating a new Transaction
exports.createTransaction = async(req, res) =>{

    try{
        const { title, amount, currency, type, category, tag, date } = req.body;
        const userId = req.user.userId;  // Get userId from the authenticated user (via JWT)

        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // create new transaction instance
        const transaction = new Transaction({userId,title,amount,currency,type,category,tag,date});

        // save the transaction to data base
        await transaction.save();

        const budget = await Budget.findOne({ userId });

        if (budget) {
            
            if (type === 'income') {
                budget.amount += amount;
            } else if (type === 'expense') {
                budget.currentSpending += amount;
            }

            await budget.save();
        }

        res.status(201).json({ message: 'Transaction created successfully' });

    }catch (error){
        console.error('Error in careate booking:',error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Controller for retrieving all transactions for a specific user
exports.getAllTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const isAdmin = req.user.role;

        console.log(isAdmin);

        // Check if the user is an admin
        if (isAdmin == 'admin') {
            // Retrieve all transactions
            const transactions = await Transaction.find({});

            // Check if there are any transactions
            if (transactions.length === 0) {
                return res.status(404).json({ error: 'No transactions found' });
            }

            res.status(200).json({ transactions });
        }
        else{
                const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const transactions = await Transaction.find({ userId: userId });

            // Check if the user has any transactions
            if (transactions.length === 0) {
                return res.status(404).json({ error: 'No transactions found for this user' });
            }

            res.status(200).json({ transactions });
        }

    } catch (error) {
        console.error('Error in getAllTransactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Controller for retrieving a single Transaction by ID
exports.getTransactionById = async (req, res) => {

    try{
        const {id} = req.params;
        const userId = req.user.userId;

        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const transaction = await Transaction.findOne({ _id: id, userId: userId });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.status(200).json({ transaction });

    }catch (error) {
        console.error('Error in getTransactionById:', error);
        
        res.status(500).json({ error: 'Internal server error' });
    }

};


// Controller for updating a Transaction by ID
exports.updateTransactionById = async (req,res) =>{
    try{
        const {id} = req.params;
        const {title,amount,currency,type,category,tag,date} = req.body;
        const userId = req.user.userId;

        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updateTransaction = await Transaction.findByIdAndUpdate({ _id: id, userId: userId },
            {
                title,
                amount,
                currency,
                type,
                category,
                tag,
                date
            },
            {new:true}
        );

        if (!updateTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        
        res.status(200).json({ message: 'Transaction updated successfully', Transaction: updateTransaction });

    }catch (error) {
        console.error('Error in updateTransactionById:', error);
        
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Controller for deleting a Transaction by ID
exports.deleteTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        
        const deletedTransaction = await Transaction.findByIdAndDelete({ _id: id, userId: userId });

        if (!deletedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        
        res.status(200).json({ message: 'Transaction deleted successfully' });

    } catch (error) {
        console.error('Error in deleteTransactionById:', error);
        
        res.status(500).json({ error: 'Internal server error' });
    }
};


//  Filter transactions by tags
exports.gettransactionsByTag = async (req, res) => {
  try {
        const { tag } = req.params;    
        const userId = req.user.userId; 

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const transactions = await Transaction.find({ tag: tag, userId: userId });

        if (transactions.length === 0) {
            return res.status(404).json({ error: 'No transactions found' });
        }
        res.status(200).json(transactions);

  } catch (error) {
    res.status(400).json({ message: 'Error filtering transactions', error });
  }
};