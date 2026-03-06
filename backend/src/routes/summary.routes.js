const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getSummary } = require('../controllers/summary.controller');

router.get("/", authMiddleware, getSummary);

module.exports = router;
