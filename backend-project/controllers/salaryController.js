const SalaryModel = require('../models/salaryModel');
const EmployeeModel = require('../models/employeeModel');
const DepartmentModel = require('../models/departmentModel');

// GET /api/salaries
exports.getAll = async (req, res) => {
  try {
    const salaries = await SalaryModel.getAll();
    return res.status(200).json(salaries);
  } catch (err) {
    console.error('GET SALARIES ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/salaries/:id
exports.getOne = async (req, res) => {
  try {
    const salary = await SalaryModel.getById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    return res.status(200).json(salary);
  } catch (err) {
    console.error('GET SALARY ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/salaries
exports.create = async (req, res) => {
  try {
    const { employeeNumber, month } = req.body;

    if (!employeeNumber || !month) {
      return res.status(400).json({ message: 'Employee and month are required' });
    }
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({ message: 'Month must be in YYYY-MM format' });
    }

    // Fetch the employee to derive the department + amounts (server-side authority)
    const employee = await EmployeeModel.getByNumber(employeeNumber);
    if (!employee) {
      return res.status(400).json({ message: 'Selected employee does not exist' });
    }
    const department = await DepartmentModel.getByCode(employee.departmentCode);
    if (!department) {
      return res.status(400).json({ message: 'Employee has no valid department' });
    }

    const grossSalary    = Number(department.grossSalary);
    const totalDeduction = Number(department.totalDeduction);
    const netSalary      = grossSalary - totalDeduction;

    await SalaryModel.create({
      employeeNumber,
      departmentCode: department.departmentCode,
      grossSalary,
      totalDeduction,
      netSalary,
      month
    });

    return res.status(201).json({
      message: 'Salary recorded successfully',
      salary: {
        employeeNumber,
        departmentCode: department.departmentCode,
        departmentName: department.departmentName,
        grossSalary,
        totalDeduction,
        netSalary,
        month
      }
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This employee already has a salary recorded for that month' });
    }
    console.error('CREATE SALARY ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/salaries/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeNumber, month } = req.body;

    if (!employeeNumber || !month) {
      return res.status(400).json({ message: 'Employee and month are required' });
    }
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({ message: 'Month must be in YYYY-MM format' });
    }

    const existing = await SalaryModel.getById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    const employee = await EmployeeModel.getByNumber(employeeNumber);
    if (!employee) {
      return res.status(400).json({ message: 'Selected employee does not exist' });
    }
    const department = await DepartmentModel.getByCode(employee.departmentCode);
    if (!department) {
      return res.status(400).json({ message: 'Employee has no valid department' });
    }

    const grossSalary    = Number(department.grossSalary);
    const totalDeduction = Number(department.totalDeduction);
    const netSalary      = grossSalary - totalDeduction;

    await SalaryModel.update(id, {
      employeeNumber,
      departmentCode: department.departmentCode,
      grossSalary,
      totalDeduction,
      netSalary,
      month
    });

    return res.status(200).json({
      message: 'Salary updated successfully',
      salary: {
        salaryId: id,
        employeeNumber,
        departmentCode: department.departmentCode,
        departmentName: department.departmentName,
        grossSalary,
        totalDeduction,
        netSalary,
        month
      }
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This employee already has a salary recorded for that month' });
    }
    console.error('UPDATE SALARY ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/salaries/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await SalaryModel.getById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    await SalaryModel.remove(id);
    return res.status(200).json({ message: 'Salary deleted successfully' });
  } catch (err) {
    console.error('DELETE SALARY ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/salaries/preview/:employeeNumber — used by the form to auto-fill
exports.preview = async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    const employee = await EmployeeModel.getByNumber(employeeNumber);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const department = await DepartmentModel.getByCode(employee.departmentCode);
    if (!department) {
      return res.status(404).json({ message: 'Department not found for this employee' });
    }
    const grossSalary    = Number(department.grossSalary);
    const totalDeduction = Number(department.totalDeduction);
    const netSalary      = grossSalary - totalDeduction;

    return res.status(200).json({
      employeeNumber: employee.employeeNumber,
      employeeName: employee.firstName + ' ' + employee.lastName,
      departmentCode: department.departmentCode,
      departmentName: department.departmentName,
      grossSalary,
      totalDeduction,
      netSalary
    });
  } catch (err) {
    console.error('PREVIEW SALARY ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/salaries/stats/summary — dashboard counts
exports.stats = async (req, res) => {
  try {
    const totalEmployees = await EmployeeModel.count();
    const totalDepartments = await DepartmentModel.count();
    const totalSalaries = await SalaryModel.count();
    return res.status(200).json({
      totalEmployees,
      totalDepartments,
      totalSalaries
    });
  } catch (err) {
    console.error('STATS ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};