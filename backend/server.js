const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = require('./app');
const { connectDB, disconnectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    // Connect to database before accepting requests
    await connectDB();

    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`===============================================`);
      console.log(` SpendWise Server Running on Port: ${PORT}`);
      console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error(`Failed to start SpendWise server: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log('\nReceived kill signal, shutting down gracefully...');
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed');
      await disconnectDB();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();
