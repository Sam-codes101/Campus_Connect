const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  createPost,
  deletePost,
  toggleLikePost,
  addComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllPosts);
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLikePost);
router.post('/:id/comments', protect, addComment);

module.exports = router;
