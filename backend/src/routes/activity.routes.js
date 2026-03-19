const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { addActivity, getActivities } = require('../controllers/activity.controller');

router.post('/addActivity', authMiddleware, addActivity);
router.get('/getActivities', authMiddleware, getActivities);

module.exports = router;