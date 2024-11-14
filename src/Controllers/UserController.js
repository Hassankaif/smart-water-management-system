// controllers/userController.js
const db = require('../config/database');

const userController = {
    async getAllUsers(req, res) {
        try {
            const [users] = await db.execute('SELECT id, name, flat_no FROM users');
            res.json({ success: true, users });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = userController;