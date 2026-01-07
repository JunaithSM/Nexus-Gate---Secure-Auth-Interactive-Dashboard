require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./src/routes/routes");
const { client } = require("./src/data/user");
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin:[
        "http://localhost:5173",              // local React
        "https://nexus-frontend.vercel.app"   // production React
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
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
