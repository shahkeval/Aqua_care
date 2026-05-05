const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

// Connect to Database
connectDB();

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});
