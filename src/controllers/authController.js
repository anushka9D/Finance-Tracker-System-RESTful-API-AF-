const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email: username, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

};

exports.login = async (req, res) => {
    
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "Invalid username or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ error: "Invalid username or password" });
        }
        const token = jwt.sign({ 
            userId: user._id, 
            role: user.role 
        }, process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updatedUser = req.body;
        await User.findByIdAndUpdate(userId, updatedUser);
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteUserByadmin = async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};