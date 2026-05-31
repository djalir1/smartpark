const db = require('../config/db');

const DepartmentModel = {
  getAll: async () => {
    const [rows] = await db.query(
      'SELECT * FROM departments ORDER BY departmentCode ASC'
    );
    return rows;
  },

  getByCode: async (code) => {
    const [rows] = await db.query(
      'SELECT * FROM departments WHERE departmentCode = ? LIMIT 1',
      [code]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const { departmentCode, departmentName, grossSalary, totalDeduction } = data;
    const [result] = await db.query(
      `INSERT INTO departments (departmentCode, departmentName, grossSalary, totalDeduction)
       VALUES (?, ?, ?, ?)`,
      [departmentCode, departmentName, grossSalary, totalDeduction]
    );
    return result;
  },

  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM departments');
    return rows[0].total;
  }
};

module.exports = DepartmentModel;