const express = require("express");

const expenseController = require("../controllers/expense");

const router = express.Router();

router.post("/expense/add", expenseController.postExpense);
router.get("/expense", expenseController.getExpense);

module.exports = router;
