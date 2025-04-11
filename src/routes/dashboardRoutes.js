const express = require('express');
const router = express.Router();
const verifyToken = require('../middilewares/authMiddileware');
const verifyRole = require('../middilewares/roleMiddileware');
const { getUserDashboard, getAdminDashboard } = require('../controllers/dashboardController');

router.get('/getuserdashboard', verifyToken, verifyRole("user"), getUserDashboard);
router.get('/getadmindashboard', verifyToken, verifyRole("admin"), getAdminDashboard);

module.exports = router;