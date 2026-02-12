const router = require("express").Router();

const expenseController = require("../controllers/expense");

router.post("/add", expenseController.addExpense);

module.exports = router;