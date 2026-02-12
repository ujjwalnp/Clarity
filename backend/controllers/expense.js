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

const deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;

        if (!expenseId) {
            return res.status(400).json({ message: "Expense ID is required" });
        }

        const deletedExpense = await ExpenseModel.findByIdAndDelete(expenseId);

        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = { addExpense, getAllExpenses, deleteExpense };