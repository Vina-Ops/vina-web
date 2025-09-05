// PeerJS Configuration
export const peerConfig = {
  // Production: Use official PeerJS servers (no custom server needed)
  // This is the recommended approach as it's more reliable and doesn't require
  // setting up your own PeerJS signaling server
  production: {
    // Use default PeerJS servers - no custom host needed
    // PeerJS will use its default signaling servers (0.peerjs.com, 1.peerjs.com, etc.)
  },

  // Development: Use localhost for reliability - HARDCODED
  development: {
    host: "localhost",
    port: 9000,
    path: "/peerjs",
    secure: false,
  },

  // Alternative: Use multiple official PeerJS servers for better reliability
  alternative: {
    host: "0.peerjs.com",
    port: 443,
    path: "/",
    secure: true,
  },

  // Backup servers in case primary fails
  backup: {
    host: "1.peerjs.com",
    port: 443,
    path: "/",
    secure: true,
  },

  // Custom: HARDCODED - NO ENVIRONMENT VARIABLES
  custom: {
    host: "localhost",
    port: 9000,
    path: "/peerjs",
    secure: false,
  },

  // ICE servers for WebRTC connection
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};

// Get the appropriate config based on environment
export const getPeerConfig = () => {
  // HARDCODED CONFIGURATION - NO ENVIRONMENT CHECKS
  const config = {
    host: "localhost",
    port: 9000,
    path: "/peerjs", // PeerJS server runs on /peerjs
    secure: false,
    config: { iceServers: peerConfig.iceServers },
  };

  // Debug logging
  console.log("🔧 PeerJS Config:", {
    environment: process.env.NODE_ENV,
    host: (config as any).host || "default PeerJS servers",
    port: (config as any).port || "default",
    secure: (config as any).secure || "default",
    path: (config as any).path || "default",
    hasCustomHost: !!process.env.NEXT_PUBLIC_PEER_HOST,
    useAlternative: process.env.NEXT_PUBLIC_PEER_USE_ALTERNATIVE === "true",
    fullUrl: (config as any).host
      ? `${(config as any).secure ? "wss" : "ws"}://${(config as any).host}:${
          (config as any).port
        }${(config as any).path}`
      : "default PeerJS servers",
  });

  return config;
};
