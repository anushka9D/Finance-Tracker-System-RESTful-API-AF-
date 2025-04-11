const express = require('express');
const router = express.Router();
const verifyToken = require('../middilewares/authMiddileware');
const verifyRole = require('../middilewares/roleMiddileware');
const { getNotifications, markAsRead } = require('../controllers/notificationController');

router.get('/getnotifications', verifyToken, verifyRole("user"), getNotifications);
router.put('/markasread/:id', verifyToken, verifyRole("user"), markAsRead);

module.exports = router;