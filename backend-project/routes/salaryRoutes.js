const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const auth = require('../middleware/auth');

// FULL CRUD per scenario
router.get('/stats/summary',          auth, salaryController.stats);
router.get('/preview/:employeeNumber',auth, salaryController.preview);
router.get('/',                       auth, salaryController.getAll);
router.get('/:id',                    auth, salaryController.getOne);
router.post('/',                      auth, salaryController.create);
router.put('/:id',                    auth, salaryController.update);
router.delete('/:id',                 auth, salaryController.remove);

module.exports = router;