const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const auth = require('../middleware/auth');

// Insert-only + Retrieve (no PUT, no DELETE per scenario)
router.get('/',        auth, departmentController.getAll);
router.get('/:code',   auth, departmentController.getOne);
router.post('/',       auth, departmentController.create);

module.exports = router;