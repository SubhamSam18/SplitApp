const express = require("express");
const authMiddleware = require('../middleware/auth.middleware');
const expenseController = require('../controllers/expense.controller');
const router = express.Router();

router.post("/", authMiddleware, expenseController.createExpense);
router.put("/:expenseId", authMiddleware, expenseController.updateExpenses);
router.delete("/:expenseId", authMiddleware, expenseController.deleteExpense);
module.exports = router;
