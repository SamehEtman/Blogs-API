const express = require('express');
const blogRouter = require('./src/routes/blog');
const userRouter = require('./src/routes/users');
require('./src/services/cache');

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(blogRouter);

module.exports = app;
