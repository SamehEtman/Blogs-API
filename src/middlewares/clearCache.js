const {clearCache} = require('../services/cache');

module.exports =async (req, res, next) => {
  try {
    await next();
    clearCache(req.user.id);
  } catch (err) {
    next(err);
  }
};
