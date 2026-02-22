const express = require("express");
const settlementController = require("../controllers/settlementController");
const authMiddleware = require("../middleware/authMiddleware");
const Settlement = require("../models/Settlement");

const router = express.Router();

router.post("/group", authMiddleware, settlementController.settleGroupPayment);
router.post("/friend", authMiddleware, settlementController.settleFriendsPayment);

module.exports = router;
