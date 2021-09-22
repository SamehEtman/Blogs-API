const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password required'],
  },
});

userSchema.methods.generateJWT = function () {
  const token = jwt.sign({ _id: this._id }, 'sameh', { expiresIn: '1d' });
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
