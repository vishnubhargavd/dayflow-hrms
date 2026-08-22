import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';

async function startServer() {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 Dayflow HRMS Backend Server running on port ${env.PORT} in [${env.NODE_ENV}] mode`);
    console.log(`📍 Health Check: http://localhost:${env.PORT}/api/v1/health`);
  });

  const gracefulShutdown = async (signal: string) => {
    console.log(`\n⚠️  Received ${signal}. Initiating graceful shutdown...`);
    server.close(async () => {
      console.log('HTTP Server closed.');
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

startServer().catch((error) => {
  console.error('Fatal error starting Dayflow HRMS Backend:', error);
  process.exit(1);
});
