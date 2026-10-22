const Post = require('../models/Post');

// @route   GET /api/posts
// @desc    Get all community feed posts
// @access  Public
const getAllPosts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    const posts = await Post.find(query)
      .populate('author', 'name branch year profileImage')
      .populate('comments.user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching posts',
    });
  }
};

// @route   POST /api/posts
// @desc    Create a community post
// @access  Private
const createPost = async (req, res) => {
  try {
    const { content, image, category } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Post content cannot be empty',
      });
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      image: image || '',
      category: category || 'General',
    });

    const populated = await Post.findById(post._id).populate(
      'author',
      'name branch year profileImage'
    );

    res.status(201).json({
      status: 'success',
      message: 'Post published to community feed',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error publishing post',
    });
  }
};

// @route   DELETE /api/posts/:id
// @desc    Delete a post (author or admin)
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found',
      });
    }

    // Must be author or admin
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized: You can only delete your own posts',
      });
    }

    await post.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error deleting post',
    });
  }
};

// @route   POST /api/posts/:id/like
// @desc    Like or Unlike a post
// @access  Private
const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found',
      });
    }

    const userIdStr = req.user._id.toString();
    const hasLiked = post.likes.some((id) => id.toString() === userIdStr);

    if (hasLiked) {
      // Remove like
      post.likes = post.likes.filter((id) => id.toString() !== userIdStr);
    } else {
      // Add like
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      status: 'success',
      message: hasLiked ? 'Post unliked' : 'Post liked',
      data: {
        likesCount: post.likes.length,
        likes: post.likes,
        hasLiked: !hasLiked,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error toggling like',
    });
  }
};

// @route   POST /api/posts/:id/comments
// @desc    Add comment to a post
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Comment text cannot be empty',
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found',
      });
    }

    post.comments.push({
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    });

    await post.save();

    const populated = await Post.findById(post._id)
      .populate('author', 'name branch year profileImage')
      .populate('comments.user', 'name profileImage');

    res.status(201).json({
      status: 'success',
      message: 'Comment added',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error adding comment',
    });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  deletePost,
  toggleLikePost,
  addComment,
};
