const db = require('../config/db');

const UserModel = {
  findByUsername: async (username) => {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT id, username, role, created_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  updatePassword: async (id, hashedPassword) => {
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows;
  }
};

module.exports = UserModel;