import { Router } from "express";
import userController from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = Router();

// User Routes (protected)
router.get("/user", auth, userController.getUser);

// Admin Routes (protected + admin only)
router.get("/admin/users", auth, adminMiddleware, userController.getAllUsers);

export default router;
