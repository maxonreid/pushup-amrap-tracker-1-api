import { Router } from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (Require JWT)
router.get("/profile", protect, getProfile);

export default router;