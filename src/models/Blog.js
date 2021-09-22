const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  _user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
