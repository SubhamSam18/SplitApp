const express = require("express");
const router = express.Router();
const groupController = require('../controllers/group.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post("/", authMiddleware, groupController.createGroup);
router.get("/", authMiddleware, groupController.getUserGroup);
router.patch("/:groupId/addMember", authMiddleware, groupController.addMember);
router.get("/:groupId/summary", authMiddleware, groupController.groupSummary);
router.get("/:groupId/activity", authMiddleware, groupController.groupActivity);

module.exports = router;
