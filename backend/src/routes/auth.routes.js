const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/changePassword", authMiddleware, authController.changePassword);
router.post("/deleteAccount", authMiddleware, authController.deleteAccount);
router.put("/updateProfile", authMiddleware, authController.updateProfile);
router.post("/uploadAvatar", authMiddleware, upload.single("avatar"), authController.uploadAvatar);
router.get("/avatar/:id", authController.getAvatar);
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

module.exports = router;
