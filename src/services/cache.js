const mongoose = require('mongoose');
const keys = require('../keys/key')

const redis = require('redis');

const redisUrl = keys.redisUrl;

const client = redis.createClient(redisUrl);
const util = require('util');
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options) {
  this.isCache = true;
  this.hashKey = JSON.stringify(options.key);
  return this;
};
mongoose.Query.prototype.exec = async function () {
  if (!this.isCache) return exec.apply(this, arguments);

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );
  const cachedItems = await client.hget(this.hashKey, key);
  if (cachedItems) {
    const docs = JSON.parse(cachedItems);
    console.log('from cache');
    return Array.isArray(docs)
      ? docs.map((doc) => new this.model(doc))
      : new this.model(docs);
  }
  console.log('from mongo');
  const results = await exec.apply(this, arguments);
  client.hset(this.hashKey, key, JSON.stringify(results), 'EX', 30);
  return results;
};

const clearCache = (key) => {
  client.del(JSON.stringify(key));
  console.log('chache cleared');
};

const closeRedis = () => {
  client.flushall();
  client.quit();
};

module.exports = {
  clearCache,
  closeRedis,
};
