const express = require('express');
const router = express.Router();
const verifyToken = require('../middilewares/authMiddileware');
const verifyRole = require('../middilewares/roleMiddileware');
const { createGoal, getGoals, updateProgress } = require('../controllers/goalController');

router.post('/creategoal', verifyToken, verifyRole("admin", "user"), createGoal);
router.get('/getgoals', verifyToken, verifyRole("admin", "user"), getGoals);
router.put('/updateprogress/:id', verifyToken, verifyRole("admin", "user"), updateProgress);

module.exports = router;
