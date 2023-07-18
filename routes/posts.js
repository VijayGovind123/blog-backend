const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');
const Post = require('../models/Post');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  // Create a new post
  const post = new Post({
    title,
    content,
    author: req.user._id,
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:postId', verifyToken, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
