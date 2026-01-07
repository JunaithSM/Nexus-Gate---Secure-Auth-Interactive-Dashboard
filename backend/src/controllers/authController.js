const bcrypt = require("bcrypt");
const saltRounds = 10;
const { client } = require("../data/user");
const { generateAccessToken, generateRefreshToken } = require("../config/token");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Check if user exists
        const check = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        if (check.rows.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }
        // Insert new user
        const result = await client.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hashedPassword]
        );

        // User should probably get a token on signup too!
        const user = result.rows[0];
        await sendTokenResponse(res, user, 201, "Signup successful");
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined!");
            return res.status(500).json({ message: "Internal server configuration error" });
        }

        await sendTokenResponse(res, user, 200, "Login successful");
    } catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const refresh = async (req, res) => {
    try {
        const refreshTokenId = req.cookies.refreshTokenId;
        if (!refreshTokenId || refreshTokenId === 'undefined') {
            return res.status(401).json({ message: "No refresh token provided" });
        }
        const result = await client.query("SELECT * FROM refresh_token where id = $1", [refreshTokenId]);
        if (result.rows.length === 0 || result.rows[0].revoked) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const user = result.rows[0];
        const token = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await client.query("UPDATE refresh_token SET revoked = true WHERE id = $1", [refreshTokenId]);
        const refreshInsert = await client.query(
            "INSERT INTO refresh_token (user_id, token_hash, created_at, expires_at) VALUES ($1, $2, $3, $4) RETURNING id",
            [user.id, bcrypt.hashSync(refreshToken.token, saltRounds), new Date(), new Date(refreshToken.exp)]
        );
        const newRefreshTokenId = refreshInsert.rows[0].id;
        res.status(200)
            .cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "none", maxAge: 5 * 60 * 60 * 1000 }) // 5 hours
            .cookie("refreshTokenId", newRefreshTokenId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 }) // 7 days
            .json({ message: "Refresh successful" });
    } catch (err) {
        console.error("Refresh error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logout = async (req, res) => {
    try {
        await client.query("UPDATE refresh_token SET revoked = true WHERE user_id = $1", [req.user.id]);
        res.clearCookie("token");
        res.clearCookie("refreshTokenId");
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const sendTokenResponse = async (res, user, statusCode, message) => {
    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const refreshInsert = await client.query(
        "INSERT INTO refresh_token (user_id, token_hash, created_at, expires_at) VALUES ($1, $2, $3, $4) RETURNING id",
        [user.id, bcrypt.hashSync(refreshToken.token, saltRounds), new Date(), new Date(refreshToken.exp)]
    );
    const refreshTokenId = refreshInsert.rows[0].id;
    res.status(statusCode)
        .cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "none", maxAge: 5 * 60 * 60 * 1000 }) // 5 hours
        .cookie("refreshTokenId", refreshTokenId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 }) // 7 days
        .json({ message: message, user });
};

module.exports = {
    signup,
    signin,
    refresh,
    logout
};
