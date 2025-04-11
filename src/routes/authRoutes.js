const express = require('express');
const router = express.Router();
const verifyToken = require('../middilewares/authMiddileware');
const verifyRole = require('../middilewares/roleMiddileware');
const { register, login, getUsers, updateUser, deleteUser, deleteUserByadmin } = require('../controllers/authController');

router.post("/register", register);
router.post("/login", login);
router.get('/getusers', verifyToken, verifyRole("admin"), getUsers);
router.put('/updateuser', verifyToken, verifyRole("admin", "user"), updateUser);
router.delete('/userdelete', verifyToken, verifyRole("user", "admin"), deleteUser);
router.delete('/deleteuserbyadmin/:id', verifyToken, verifyRole("admin"), deleteUserByadmin);


module.exports = router;