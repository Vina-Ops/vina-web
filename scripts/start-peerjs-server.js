#!/usr/bin/env node

const { PeerServer } = require("peerjs");

// Get configuration from environment variables
const port = parseInt(process.env.PEERJS_PORT || process.env.PORT || "9000");
const host = process.env.PEERJS_HOST || "0.0.0.0";
const path = process.env.PEERJS_PATH || "/peerjs";
const isProduction = process.env.NODE_ENV === "production";

const server = PeerServer({
  port: port,
  host: host,
  path: path,
  allow_discovery: true,
  // Add CORS configuration for production
  ...(isProduction && {
    cors: {
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  }),
});

const protocol = isProduction ? "https" : "http";
const wsProtocol = isProduction ? "wss" : "ws";

console.log(`🚀 PeerJS Server started on ${host}:${port}`);
console.log(`📡 WebSocket endpoint: ${wsProtocol}://${host}:${port}${path}`);
console.log(`🌐 HTTP endpoint: ${protocol}://${host}:${port}${path}`);
console.log(`🌍 Environment: ${isProduction ? "production" : "development"}`);

server.on("connection", (client) => {
  console.log(`✅ Client connected: ${client.getId()}`);
});

server.on("disconnect", (client) => {
  console.log(`❌ Client disconnected: ${client.getId()}`);
});

process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down PeerJS server...");
  server.close();
  process.exit(0);
});
