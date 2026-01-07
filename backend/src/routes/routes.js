const router = require("express").Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Auth Routes
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.patch("/refresh", authController.refresh);
router.patch("/logout", auth, authController.logout);

// User Routes
router.get("/user", auth, userController.getUser);

// Admin Routes
router.get("/admin/users", auth, adminMiddleware, userController.getAllUsers);

module.exports = router;