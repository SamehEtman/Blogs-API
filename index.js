const app = require('./app');
const port = process.env.PORT || 3000;
const connectDB = require('./src/db/mongoose');
require('./src/services/cache');

connectDB();

app.listen(port, () => {
  console.log('server is running on port ', port);
});
