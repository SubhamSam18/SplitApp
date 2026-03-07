const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware.js');
const analyticsController = require("../controllers/analytics.controller.js");

router.get("/:month", authMiddleware, analyticsController.getUserAnalytics);

module.exports = router;