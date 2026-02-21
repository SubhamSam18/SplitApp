const express = require("express");
const router = express.Router();
const friendsController = require("../controllers/friendsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, friendsController.getFriends);
module.exports = router;
