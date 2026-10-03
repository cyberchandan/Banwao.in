require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database & Start Server
const startServer = async () => {
  await connectDB();
  
  const server = app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` 🏗️  BANWAO HOME SERVICES & CONSTRUCTION MARKETPLACE`);
    console.log(` 🚀  Server running on http://localhost:${PORT}`);
    console.log(` 📍  Serving Noida & Greater Noida marketplace`);
    console.log(`=================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n⚠️  Port ${PORT} is already in use by another process.`);
      console.error(`Please stop existing node processes or run: npx kill-port ${PORT}\n`);
      process.exit(1);
    } else {
      console.error(`Server error:`, err);
    }
  });
};

startServer();
