const express = require("express");
const router = express.Router();
const authRouter = require("./auth")
const expenseRouter = require("./expense")

router.use("/auth", authRouter);
router.use("/expense", expenseRouter);

module.exports = router;
