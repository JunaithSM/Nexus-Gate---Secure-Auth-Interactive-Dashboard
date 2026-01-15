import { Router } from "express";
import authController from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";

const router = Router();

// Auth Routes
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/refresh", authController.refresh);
router.post("/logout", auth, authController.logout);

export default router;
