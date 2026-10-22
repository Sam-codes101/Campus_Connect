const express = require('express');
const router = express.Router();
const {
  getUserById,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', getUserById);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
