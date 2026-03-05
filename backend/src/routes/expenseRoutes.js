const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const expenseController = require("../controllers/expenseController");
const router = express.Router();

router.post("/", authMiddleware, expenseController.createExpense);
router.put("/:expenseId", authMiddleware, expenseController.updateExpenses);
router.delete("/:expenseId", authMiddleware, expenseController.deleteExpense);
module.exports = router;
