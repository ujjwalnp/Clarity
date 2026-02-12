const { Schema, model } = require("mongoose");

const expenseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
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