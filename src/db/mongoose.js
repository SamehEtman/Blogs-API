const mongoose = require('mongoose');
const keys = require('../keys/key');

const connectDB = async () => {
  await mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
module.exports = connectDB;
