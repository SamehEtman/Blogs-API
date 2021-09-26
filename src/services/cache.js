const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../keys/key');
console.log(keys.key)
const client = redis.createClient(keys.redisUrl);

client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options) {
  this.isCache = true;
  this.hKey = JSON.stringify(options.key);
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.isCache) return exec.apply(this, arguments);

  const query = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );
  const items = await client.hget(this.hKey, query);

  if (items) {
    const docs = JSON.parse(items);

    return Array.isArray(docs)
      ? docs.map((doc) => this.model(doc))
      : this.model(docs);
  }

  const results = await exec.apply(this, arguments);
  client.hset(this.hKey, query, JSON.stringify(results), 'EX', 10);
  return results;
};

module.exports = {
  clearCache(key) {
    client.del(JSON.stringify(key));
  },
  closeRedis() {
    client.quit();
  },
};
