const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    const { workerId, category, description } = req.body;
    const userId = req.user._id;

    const newPost = new Post({
      customerId: userId,
      workerId,
      category,
      description,
    });

    await newPost.save();
    res.status(201).json({ message: "Request sent successfully", post: newPost });
  } catch (err) {
    console.error("Post creation failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createPost };
