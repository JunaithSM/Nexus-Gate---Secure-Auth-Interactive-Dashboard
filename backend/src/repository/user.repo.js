import { POOL } from "../config/db.js";

const userRepo = {
    create: async (user) => {
        const result = await POOL.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role",
            [user.name, user.email, user.password]
        );
        return result.rows[0];
    },
    getByEmail: async (email) => {
        const result = await POOL.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        return result.rows[0];
    },
    getById: async (id) => {
        const result = await POOL.query(
            "SELECT id, name, email, role FROM users WHERE id = $1",
            [id]
        );
        return result.rows[0];
    },
    getAll: async () => {
        const result = await POOL.query(
            "SELECT id, name, email, role FROM users"
        );
        return result.rows;
    },
    update: async (user) => {
        const result = await POOL.query(
            "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email, role",
            [user.name, user.email, user.password, user.id]
        );
        return result.rows[0];
    },
    delete: async (userId) => {
        const result = await POOL.query(
            "DELETE FROM users WHERE id = $1 RETURNING id, name, email",
            [userId]
        );
        return result.rows[0];
    }
};

export default userRepo;