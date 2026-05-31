const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');

// Insert-only + Retrieve (no PUT, no DELETE per scenario)
router.get('/next-number',         auth, employeeController.getNextNumber);
router.get('/',                    auth, employeeController.getAll);
router.get('/:employeeNumber',     auth, employeeController.getOne);
router.post('/',                   auth, employeeController.create);

module.exports = router;