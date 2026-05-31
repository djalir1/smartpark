const DepartmentModel = require('../models/departmentModel');

// GET /api/departments
exports.getAll = async (req, res) => {
  try {
    const departments = await DepartmentModel.getAll();
    return res.status(200).json(departments);
  } catch (err) {
    console.error('GET DEPARTMENTS ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/departments/:code
exports.getOne = async (req, res) => {
  try {
    const department = await DepartmentModel.getByCode(req.params.code);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    return res.status(200).json(department);
  } catch (err) {
    console.error('GET DEPARTMENT ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/departments  (insert-only — no PUT/DELETE)
exports.create = async (req, res) => {
  try {
    let { departmentCode, departmentName, grossSalary, totalDeduction } = req.body;

    // Validation
    if (!departmentCode || !departmentName || grossSalary === undefined || totalDeduction === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    departmentCode = String(departmentCode).trim().toUpperCase();
    if (!/^[A-Z]{1,10}$/.test(departmentCode)) {
      return res.status(400).json({ message: 'Department code must be 1-10 uppercase letters' });
    }
    if (departmentName.trim().length === 0) {
      return res.status(400).json({ message: 'Department name cannot be empty' });
    }
    const gross = Number(grossSalary);
    const ded   = Number(totalDeduction);
    if (isNaN(gross) || gross <= 0) {
      return res.status(400).json({ message: 'Gross salary must be a positive number' });
    }
    if (isNaN(ded) || ded < 0) {
      return res.status(400).json({ message: 'Total deduction cannot be negative' });
    }
    if (ded >= gross) {
      return res.status(400).json({ message: 'Total deduction cannot be greater than or equal to gross salary' });
    }

    await DepartmentModel.create({
      departmentCode,
      departmentName: departmentName.trim(),
      grossSalary: gross,
      totalDeduction: ded
    });

    return res.status(201).json({
      message: 'Department created successfully',
      department: { departmentCode, departmentName, grossSalary: gross, totalDeduction: ded }
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Department code already exists' });
    }
    console.error('CREATE DEPARTMENT ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};