const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const expenseController = require("../controllers/expenseController");
const router = express.Router();

router.post("/", authMiddleware, expenseController.createExpense);

module.exports = router;
