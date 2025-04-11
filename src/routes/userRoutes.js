const express = require('express');
const router = express.Router();
const verifyToken = require ("../middilewares/authMiddileware");
const  authorizeRoles  = require("../middilewares/roleMiddileware");

//only admin can access this route
router.get("/admin" , verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Hello Admin wellcome" });
});

//All users can access this route
router.get("/user", verifyToken, authorizeRoles("admin", "user"), (req, res) => {
    res.json({ message: "Hello User wellcome" });
});

module.exports = router;