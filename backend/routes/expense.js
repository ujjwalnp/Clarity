const router = require("express").Router();

const expenseController = require("../controllers/expense");

router.get("/:userId", expenseController.getAllExpenses);
router.post("/add", expenseController.addExpense);

module.exports = router;