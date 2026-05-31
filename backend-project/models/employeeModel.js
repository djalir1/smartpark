const db = require('../config/db');

const EmployeeModel = {
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT e.*, d.departmentName, d.grossSalary AS deptGrossSalary, d.totalDeduction AS deptTotalDeduction
       FROM employees e
       JOIN departments d ON e.departmentCode = d.departmentCode
       ORDER BY e.employeeNumber ASC`
    );
    return rows;
  },

  getByNumber: async (employeeNumber) => {
    const [rows] = await db.query(
      `SELECT e.*, d.departmentName, d.grossSalary AS deptGrossSalary, d.totalDeduction AS deptTotalDeduction
       FROM employees e
       JOIN departments d ON e.departmentCode = d.departmentCode
       WHERE e.employeeNumber = ? LIMIT 1`,
      [employeeNumber]
    );
    return rows[0] || null;
  },

  // Auto-generate the next EMP-### code
  generateNextNumber: async () => {
    const [rows] = await db.query(
      `SELECT employeeNumber FROM employees
       ORDER BY CAST(SUBSTRING(employeeNumber, 5) AS UNSIGNED) DESC
       LIMIT 1`
    );
    let next = 1;
    if (rows.length > 0 && rows[0].employeeNumber) {
      next = parseInt(rows[0].employeeNumber.split('-')[1], 10) + 1;
    }
    return 'EMP-' + String(next).padStart(3, '0');
  },

  create: async (data) => {
    const {
      employeeNumber, firstName, lastName, position,
      address, telephone, gender, hiredDate, departmentCode
    } = data;
    const [result] = await db.query(
      `INSERT INTO employees
       (employeeNumber, firstName, lastName, position, address, telephone, gender, hiredDate, departmentCode)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employeeNumber, firstName, lastName, position, address, telephone, gender, hiredDate, departmentCode]
    );
    return result;
  },

  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM employees');
    return rows[0].total;
  }
};

module.exports = EmployeeModel;