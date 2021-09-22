const { clearCache } = require('../services/cache');
module.exports = async (req, res, next) => {
  await next();
  console.log(req.user.id)
  clearCache(req.user.id);
};
