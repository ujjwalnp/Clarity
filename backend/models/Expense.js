const { Schema, model } = require("mongoose");

const expenseSchema = new Schema({
    title: {
        type: String,
        required: true
    }, amount: {
        type: Number, 
        required: true
    }, date: {
        type: Date,
        required: true
    }, description: {
        type: String
    }
}, {timestamps: true});

const Expense = model("Expense", expenseSchema);

module.exports = Expense;