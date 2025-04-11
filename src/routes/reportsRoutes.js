const express = require('express');
const router = express.Router();
const verifyToken = require('../middilewares/authMiddileware');
const verifyRole = require('../middilewares/roleMiddileware');
const { getReports, getReportById } = require('../controllers/reportController');

router.get('/getreports', verifyToken, verifyRole("admin"), getReports);
router.get('/getreportbyid', verifyToken, verifyRole("user"), getReportById);

module.exports = router;