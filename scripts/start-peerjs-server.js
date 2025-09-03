#!/usr/bin/env node

const { PeerServer } = require("peerjs");

const server = PeerServer({
  port: 9000,
  path: "/peerjs",
  allow_discovery: true,
});

console.log("🚀 PeerJS Server started on port 9000");
console.log("📡 WebSocket endpoint: ws://localhost:9000/peerjs");
console.log("🌐 HTTP endpoint: http://localhost:9000/peerjs");

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
