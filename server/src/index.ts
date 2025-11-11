import { createApp } from './app';
import { config, validateEnv } from './config/env';

async function startServer() {
  try {
    // Validate environment variables
    validateEnv();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.port, () => {
      console.log('╔════════════════════════════════════════════════╗');
      console.log('║           AIblog API Server Started            ║');
      console.log('╚════════════════════════════════════════════════╝');
      console.log(`
🚀 Server running on: http://localhost:${config.port}
🌍 Environment: ${config.nodeEnv}
📝 API Endpoints:
   - Health: http://localhost:${config.port}/api/health
   - GitHub: http://localhost:${config.port}/api/github
   - Posts:  http://localhost:${config.port}/api/posts

Press Ctrl+C to stop the server
      `);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
