const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {

    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify( token , 'sameh');
    const user = await User.findById(decoded._id).cache ({
      key : decoded._id
    });
    if (!user) {
      return res.status(401).json({
        msg: 'not allowed',
      });
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
