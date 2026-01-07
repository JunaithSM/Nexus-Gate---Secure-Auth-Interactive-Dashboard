const { client } = require("../data/user");

const getUser = async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
        const user = result.rows[0];
        res.json(user);
    } catch (err) {
        console.error("Get user error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT users.id, users.name, users.email, users.role, refresh_token.created_at as last_login 
            FROM users 
            LEFT JOIN refresh_token ON users.id = refresh_token.user_id 
            ORDER BY users.id ASC
        `;
        const result = await client.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Get all users error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getUser,
    getAllUsers
};
