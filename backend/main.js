require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const router = require("./src/routes/routes");
const { client } = require("./src/data/user");
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/", router);
app.get("/admin", (req, res) => {
    client.query("SELECT * FROM users")
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        });

});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
