const express = require('express');
const router = express.Router();
const verifyToken = require('../middilewares/authMiddileware');
const verifyRole = require('../middilewares/roleMiddileware');
const { createBudget, getBudgets, checkBudgetStatus, getSpendingRecommendations, notifyBudgetExceeded } = require('../controllers/budgetController');

router.post('/createbudget', verifyToken, verifyRole("admin", "user"), createBudget);
router.get('/getbudgets', verifyToken, verifyRole("admin", "user"), getBudgets);
router.get('/budget/status', verifyToken, verifyRole("admin", "user"), checkBudgetStatus);
router.get('/budget/recommendations', verifyToken, verifyRole("admin", "user"), getSpendingRecommendations); 
router.post('/budget/notify/exceeded', verifyToken, verifyRole("admin", "user"), notifyBudgetExceeded);

module.exports = router;