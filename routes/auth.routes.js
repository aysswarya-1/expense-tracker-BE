import express from 'express'
import { registerUser, loginUser, getUserInfo, verifyEmail, forgotPassword, resetPassword, checkAuth } from '../controllers/auth.controller.js'
import { protect } from '../middleware/AuthMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router()

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);
router.get("/check-auth", protect, checkAuth);

router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

router.post("/upload-image", upload.single("image"), uploadImage);

export default router;