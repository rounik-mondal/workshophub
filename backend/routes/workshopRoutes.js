const express = require('express');
const router = express.Router();
const {verifyToken, requireRole} = require('../middleware/authMiddleware');
const {createWorkshop, updateWorkshop, deleteWorkshop, getWorkshop, getWorkshops} = require('../controllers/workshopController');

router.get('/', getWorkshops);
router.get('/:id', getWorkshop);
router.post('/', verifyToken, requireRole(['admin']), createWorkshop);
router.put('/:id', verifyToken, requireRole(['admin']), updateWorkshop);
router.delete('/:id', verifyToken, requireRole(['admin']), deleteWorkshop);

module.exports = router;