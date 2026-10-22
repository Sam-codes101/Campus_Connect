const express = require('express');
const router = express.Router();
const {
  createUpdate,
  editUpdate,
  deleteUpdate,
} = require('../controllers/updateController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes here require Admin role
router.use(protect, adminOnly);

router.post('/updates', createUpdate);
router.put('/updates/:id', editUpdate);
router.delete('/updates/:id', deleteUpdate);

module.exports = router;
