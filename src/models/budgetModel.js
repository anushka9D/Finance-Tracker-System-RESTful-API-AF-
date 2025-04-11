const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: { 
        type: String, 
        default: 'USD',
    },
    period: {
        type: String, 
        default: 'monthly',

    },
    currentSpending: {
        type: Number,
        default: 0,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model("Budget", budgetSchema);