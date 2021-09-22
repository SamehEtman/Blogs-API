const mongoose = require('mongoose');
const keys = require('../../src/keys/dev');
const Blog = require('../../src/models/Blog');
const User = require('../../src/models/User');
const { closeRedis } = require('../../src/services/cache');
const connectTestDB = async () => {
  await mongoose.connect(keys.mongoURITest, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
const disconnectTestDB = async () => {
  await mongoose.connection.close();
};
const diconnectRedis = () => {
  closeRedis();
};
const userId = mongoose.Types.ObjectId();

const user = {
  email: 'test@test.com',
  password: 'test',
  _id: userId,
};

const blogOne = {
  title: 'test',
  content: 'test',
  _user: userId,
  _id: mongoose.Types.ObjectId(),
};

const blogTwo = {
  title: 'test',
  content: 'test',
  _user: mongoose.Types.ObjectId(),
  _id: mongoose.Types.ObjectId(),
};

const setUpEnv = async () => {
  await User.deleteMany();
  await Blog.deleteMany();
  await User.create(user);
  await Blog.create(blogOne);
  await Blog.create(blogTwo);
};

module.exports = {
  user,
  blogOne,
  blogTwo,
  userId,
  connectTestDB,
  setUpEnv,
  disconnectTestDB,
  diconnectRedis,
};
