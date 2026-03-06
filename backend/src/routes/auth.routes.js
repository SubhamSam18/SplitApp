const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

module.exports = router;
