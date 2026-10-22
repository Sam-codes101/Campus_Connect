const express = require('express');
const router = express.Router();
const {
  getAllUpdates,
  getUpdateById,
} = require('../controllers/updateController');

router.get('/', getAllUpdates);
router.get('/:id', getUpdateById);

module.exports = router;
