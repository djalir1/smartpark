const SalaryModel = require('../models/salaryModel');

// GET /api/reports/monthly?month=YYYY-MM&departmentCode=XX
exports.monthly = async (req, res) => {
  try {
    const { month, departmentCode } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Month is required (format YYYY-MM)' });
    }
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({ message: 'Month must be in YYYY-MM format' });
    }

    const records = await SalaryModel.getByMonth(month, departmentCode || null);

    const summary = records.reduce((acc, r) => {
      acc.totalGross     += Number(r.grossSalary);
      acc.totalDeduction += Number(r.totalDeduction);
      acc.totalNet       += Number(r.netSalary);
      acc.employeeCount  += 1;
      return acc;
    }, { totalGross: 0, totalDeduction: 0, totalNet: 0, employeeCount: 0 });

    return res.status(200).json({
      month,
      departmentCode: departmentCode || null,
      records,
      summary
    });
  } catch (err) {
    console.error('REPORT ERROR:', err);
    return res.status(500).json({ message: 'Server error while generating report' });
  }
};