const mongoose = require("mongoose");
const ExpenseModel = require("../models/Expense")

const addExpense = async (req, res, next) => {
    try {
        const { userId, title, amount, date, description } = req.body;

        if (!userId || !title || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const expense = new ExpenseModel({ userId, title, amount, date, description });
        await expense.save();

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getAllExpenses = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const expenses = await ExpenseModel.find({ userId });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}



module.exports = { addExpense, getAllExpenses };