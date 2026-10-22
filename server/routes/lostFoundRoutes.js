const express = require('express');
const router = express.Router();
const {
  getAllLostFound,
  createLostFound,
  getLostFoundById,
  updateLostFound,
  deleteLostFound,
} = require('../controllers/lostFoundController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllLostFound);
router.post('/', protect, createLostFound);
router.get('/:id', getLostFoundById);
router.put('/:id', protect, updateLostFound);
router.delete('/:id', protect, deleteLostFound);

module.exports = router;
