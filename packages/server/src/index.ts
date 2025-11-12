import app from "./app";
import { env } from "./config/env";

const PORT = Number(env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Closing server...`);
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason: Error) => {
  console.error("Unhandled Rejection:", reason);
  shutdown("Unhandled Rejection");
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  shutdown("Uncaught Exception");
});
