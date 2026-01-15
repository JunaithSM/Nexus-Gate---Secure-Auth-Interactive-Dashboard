import userRepo from '../repository/user.repo.js'

const getUser = async (req, res) => {
    try {
        const user = await userRepo.getById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Get user error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userRepo.getAll();
        res.json(users);
    } catch (err) {
        console.error("Get all users error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    getAllUsers,
    getUser
}