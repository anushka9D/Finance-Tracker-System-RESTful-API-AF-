const express = require('express');
const router = express.Router();
const verifyToken = require('../middilewares/authMiddileware');
const verifyRole = require('../middilewares/roleMiddileware');
const { 
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransactionById, 
    deleteTransactionById,
    gettransactionsByTag

} = require('../controllers/transactionController');

router.post('/createtransaction', verifyToken, verifyRole("admin", "user"), createTransaction);
router.get('/getalltransactions', verifyToken, verifyRole("admin", "user"), getAllTransactions);
router.get('/gettransaction/:id', verifyToken, verifyRole("admin", "user"), getTransactionById);
router.put('/updatetransaction/:id', verifyToken, verifyRole("admin", "user"), updateTransactionById);
router.delete('/deletetransaction/:id', verifyToken, verifyRole("admin", "user"), deleteTransactionById);
router.get('/gettransactionsbytag/:tag', verifyToken, verifyRole("user"), gettransactionsByTag);

module.exports = router;