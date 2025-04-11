const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },
    title: {
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
    type: {
        type: String,
        required: true,
        enum: ["income", "expense"],
    },
    category: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },

});
module.exports = mongoose.model("Transaction", transactionSchema);