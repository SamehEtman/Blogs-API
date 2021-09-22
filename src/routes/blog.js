const express = require('express');
const auth = require('../middlewares/auth');
const Blog = require('../models/Blog');
const router = express.Router();



router.get('/blogs', auth, async (req, res, next) => {
  try {
    const id = req.user._id;

    const blogs = await Blog.find({_user : id}).cache({
        id
    });


    res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
});

router.post('/blog', auth, async (req, res, next) => {
  try {
    const blog = new Blog({ ...req.body, _user: req.user._id });
    await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
