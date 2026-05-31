const db = require('../config/db');

const SalaryModel = {
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT s.*,
              e.firstName, e.lastName, e.position,
              d.departmentName
       FROM salaries s
       JOIN employees e   ON s.employeeNumber = e.employeeNumber
       JOIN departments d ON s.departmentCode = d.departmentCode
       ORDER BY s.salaryId DESC`
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT s.*,
              e.firstName, e.lastName, e.position,
              d.departmentName
       FROM salaries s
       JOIN employees e   ON s.employeeNumber = e.employeeNumber
       JOIN departments d ON s.departmentCode = d.departmentCode
       WHERE s.salaryId = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const {
      employeeNumber, departmentCode, grossSalary,
      totalDeduction, netSalary, month
    } = data;
    const [result] = await db.query(
      `INSERT INTO salaries
       (employeeNumber, departmentCode, grossSalary, totalDeduction, netSalary, month)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [employeeNumber, departmentCode, grossSalary, totalDeduction, netSalary, month]
    );
    return result;
  },

  update: async (id, data) => {
    const {
      employeeNumber, departmentCode, grossSalary,
      totalDeduction, netSalary, month
    } = data;
    const [result] = await db.query(
      `UPDATE salaries
       SET employeeNumber = ?, departmentCode = ?, grossSalary = ?,
           totalDeduction = ?, netSalary = ?, month = ?
       WHERE salaryId = ?`,
      [employeeNumber, departmentCode, grossSalary, totalDeduction, netSalary, month, id]
    );
    return result.affectedRows;
  },

  remove: async (id) => {
    const [result] = await db.query(
      'DELETE FROM salaries WHERE salaryId = ?',
      [id]
    );
    return result.affectedRows;
  },

  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM salaries');
    return rows[0].total;
  },

  // For report
  getByMonth: async (month, departmentCode = null) => {
    let sql = `
      SELECT s.salaryId, s.month,
             e.employeeNumber, e.firstName, e.lastName, e.position,
             d.departmentCode, d.departmentName,
             s.grossSalary, s.totalDeduction, s.netSalary
      FROM salaries s
      JOIN employees e   ON s.employeeNumber = e.employeeNumber
      JOIN departments d ON s.departmentCode = d.departmentCode
      WHERE s.month = ?`;
    const params = [month];
    if (departmentCode) {
      sql += ' AND s.departmentCode = ?';
      params.push(departmentCode);
    }
    sql += ' ORDER BY d.departmentCode ASC, e.employeeNumber ASC';
    const [rows] = await db.query(sql, params);
    return rows;
  }
};

module.exports = SalaryModel;