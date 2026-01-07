require("dotenv").config();
const jwt = require("jsonwebtoken");
const generateAccessToken = (user) => {
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "5h" }
    );
    return token;
}
const generateRefreshToken = (user) => {
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    return { token: token, exp: jwt.decode(token).exp };
}
module.exports = {
    generateAccessToken,
    generateRefreshToken
}