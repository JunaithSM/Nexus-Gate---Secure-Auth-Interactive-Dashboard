import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import authRoutes from "./src/routes/authRoutes.js";
import apiRoutes from "./src/routes/apiRoutes.js";
import { FRONTEND_URL, PORT, isProduction } from "./src/config/env.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { message: "Too many requests, please try again later" }
});
app.use(limiter);

// CORS configuration for cross-domain (Vercel -> Render)
const corsOptions = {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);  // Authentication routes: /auth/signup, /auth/signin, /auth/refresh, /auth/logout
app.use("/api", apiRoutes);    // API routes: /api/user, /api/admin/users

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", environment: isProduction ? "production" : "development" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} (${isProduction ? 'production' : 'development'})`);
});
