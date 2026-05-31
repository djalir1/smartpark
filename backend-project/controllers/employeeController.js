const EmployeeModel = require('../models/employeeModel');
const DepartmentModel = require('../models/departmentModel');

// GET /api/employees
exports.getAll = async (req, res) => {
  try {
    const employees = await EmployeeModel.getAll();
    return res.status(200).json(employees);
  } catch (err) {
    console.error('GET EMPLOYEES ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/employees/:employeeNumber
exports.getOne = async (req, res) => {
  try {
    const employee = await EmployeeModel.getByNumber(req.params.employeeNumber);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.status(200).json(employee);
  } catch (err) {
    console.error('GET EMPLOYEE ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/employees/next-number  — preview next EMP-### for the form
exports.getNextNumber = async (req, res) => {
  try {
    const next = await EmployeeModel.generateNextNumber();
    return res.status(200).json({ employeeNumber: next });
  } catch (err) {
    console.error('NEXT NUMBER ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/employees  (insert-only — no PUT/DELETE)
exports.create = async (req, res) => {
  try {
    let {
      firstName, lastName, position,
      address, telephone, gender, hiredDate, departmentCode
    } = req.body;

    // Validation
    if (!firstName || !lastName || !position || !address || !telephone || !gender || !hiredDate || !departmentCode) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!/^[A-Za-z\s'-]{2,50}$/.test(firstName) || !/^[A-Za-z\s'-]{2,50}$/.test(lastName)) {
      return res.status(400).json({ message: 'First and last name must be 2-50 letters' });
    }
    if (!/^07[0-9]{8}$/.test(telephone)) {
      return res.status(400).json({ message: 'Telephone must be 10 digits starting with 07' });
    }
    if (!['Male', 'Female'].includes(gender)) {
      return res.status(400).json({ message: 'Gender must be Male or Female' });
    }
    const hired = new Date(hiredDate);
    const today = new Date(); today.setHours(23,59,59,999);
    if (isNaN(hired.getTime()) || hired > today) {
      return res.status(400).json({ message: 'Hired date cannot be in the future' });
    }

    // Confirm department exists
    const dept = await DepartmentModel.getByCode(departmentCode);
    if (!dept) {
      return res.status(400).json({ message: 'Selected department does not exist' });
    }

    // Auto-generate employee number
    const employeeNumber = await EmployeeModel.generateNextNumber();

    await EmployeeModel.create({
      employeeNumber,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      position: position.trim(),
      address: address.trim(),
      telephone,
      gender,
      hiredDate,
      departmentCode
    });

    return res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        employeeNumber, firstName, lastName, position,
        address, telephone, gender, hiredDate, departmentCode,
        departmentName: dept.departmentName
      }
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Employee number already exists' });
    }
    console.error('CREATE EMPLOYEE ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};