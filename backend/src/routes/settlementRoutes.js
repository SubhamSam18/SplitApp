const express = require("express");
const settlementController = require("../controllers/settlementController");
const authMiddleware = require("../middleware/authMiddleware");
const Settlement = require("../models/Settlement");

const router = express.Router();

router.post("/", authMiddleware, settlementController.settlePayment);

module.exports = router;
