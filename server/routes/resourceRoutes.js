const express = require('express');
const router = express.Router();
const {
  getAllResources,
  createResource,
  getResourceById,
  deleteResource,
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllResources);
router.post('/', protect, createResource);
router.get('/:id', getResourceById);
router.delete('/:id', protect, deleteResource);

module.exports = router;
