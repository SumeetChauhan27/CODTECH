const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Sort by newest first and populate author details
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email');
    res.json(posts);
  } catch (err) {
    console.error('Fetch Posts Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a single post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error('Fetch Post Error:', err.message);
    if (err.name === 'CastError' || err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Post ID format' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'Please provide both title and body' });
    }

    const newPost = new Post({
      title,
      body,
      author: req.user.id // Pulled securely from the JWT token via middleware
    });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Create Post Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (Author only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, body } = req.body;
    
    if (!title && !body) {
       return res.status(400).json({ message: 'Please provide a title or body to update' });
    }

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ownership Verification: Ensure logged-in user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to edit this post' });
    }

    // Apply updates
    if (title) post.title = title;
    if (body) post.body = body;

    await post.save(); // Automatically updates the 'updatedAt' timestamp
    res.json(post);
  } catch (err) {
    console.error('Update Post Error:', err.message);
    if (err.name === 'CastError' || err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Post ID format' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (Author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ownership Verification: Ensure logged-in user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed successfully' });
  } catch (err) {
    console.error('Delete Post Error:', err.message);
    if (err.name === 'CastError' || err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Post ID format' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
