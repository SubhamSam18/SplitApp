const express = require("express");
const settlementController = require('../controllers/settlement.controller');
const authMiddleware = require('../middleware/auth.middleware');
const Settlement = require('../models/settlement.model');

const router = express.Router();

router.post("/group", authMiddleware, settlementController.settleGroupPayment);
router.post("/friend", authMiddleware, settlementController.settleFriendsPayment);

module.exports = router;
