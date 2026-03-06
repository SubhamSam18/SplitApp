const express = require("express");
const router = express.Router();
const friendsController = require('../controllers/friends.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get("/", authMiddleware, friendsController.getFriends);
module.exports = router;
