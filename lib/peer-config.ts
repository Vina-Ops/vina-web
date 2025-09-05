// PeerJS Configuration
export const peerConfig = {
  // Production: Use a reliable public PeerJS server
  production: {
    host: "vina-ai.onrender.com",
    port: 443,
    path: "/",
    secure: true,
  },

  // Development: Use localhost for reliability
  development: {
    host: "localhost",
    port: 9000,
    path: "/",
    secure: false,
  },

  // Alternative: Use a different public server
  alternative: {
    host: "vina-ai.onrender.com",
    port: 443,
    path: "/",
    secure: true,
  },

  // Custom: Override with environment variables
  custom: {
    host: process.env.NEXT_PUBLIC_PEER_HOST || "vina-ai.onrender.com",
    port: parseInt(process.env.NEXT_PUBLIC_PEER_PORT || "443"),
    path: process.env.NEXT_PUBLIC_PEER_PATH || "/",
    secure: process.env.NEXT_PUBLIC_PEER_PORT !== "9000", // Default to secure for public servers
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
  const config = (() => {
    if (process.env.NODE_ENV === "production") {
      return {
        ...peerConfig.production,
        config: { iceServers: peerConfig.iceServers },
      };
    }

    // Check if custom config is provided via environment variables
    if (process.env.NEXT_PUBLIC_PEER_HOST) {
      return {
        ...peerConfig.custom,
        config: { iceServers: peerConfig.iceServers },
      };
    }

    // Try alternative server if development server fails
    if (process.env.NEXT_PUBLIC_PEER_USE_ALTERNATIVE === "true") {
      return {
        ...peerConfig.alternative,
        config: { iceServers: peerConfig.iceServers },
      };
    }

    return {
      ...peerConfig.development,
      config: { iceServers: peerConfig.iceServers },
    };
  })();

  // Debug logging
  console.log("🔧 PeerJS Config:", {
    environment: process.env.NODE_ENV,
    host: config.host,
    port: config.port,
    secure: config.secure,
    path: config.path,
    hasCustomHost: !!process.env.NEXT_PUBLIC_PEER_HOST,
    useAlternative: process.env.NEXT_PUBLIC_PEER_USE_ALTERNATIVE === "true",
    fullUrl: `${config.secure ? "wss" : "ws"}://${config.host}:${config.port}${
      config.path
    }`,
  });

  return config;
};
