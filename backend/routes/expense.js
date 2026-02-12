const router = require("express").Router();

const expenseController = require("../controllers/expense");

router.get("/:userId", expenseController.getAllExpenses);
router.post("/add", expenseController.addExpense);
router.delete("/:expenseId", expenseController.deleteExpense);
router.patch("/:expenseId", expenseController.updateExpense);

module.exports = router;