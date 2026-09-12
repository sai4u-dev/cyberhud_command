import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Validate required env
const requiredEnv = ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  console.error("Check backend/.env.example and create backend/.env");
  // Don't exit in development, just warn
  if (process.env.NODE_ENV === "production") process.exit(1);
}

const start = async () => {
  if (process.env.MONGO_URI) {
    await connectDB();
  } else {
    console.warn("MONGO_URI not set - running without DB (API will fail on DB operations)");
  }

  const server = app.listen(PORT, () => {
    console.log(`\n⚡ CYBERHUD_COMMAND Backend online`);
    console.log(`   → http://localhost:${PORT}/api/health`);
    console.log(`   → Env: ${process.env.NODE_ENV || "development"}`);
    console.log(`   → Frontend CORS: ${process.env.FRONTEND_URL || "http://localhost:5173"}\n`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log("\nShutting down gracefully...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

start();
