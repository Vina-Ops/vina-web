// PeerJS Configuration for Development and Production
export const getPeerConfig = () => {
  // Determine if we're in development or production
  const isDevelopment = process.env.NODE_ENV === "development";

  // Get configuration from environment variables with fallbacks
  const peerHost =
    process.env.NEXT_PUBLIC_PEERJS_HOST ||
    (isDevelopment ? "localhost" : "vina-web.vercel.app");

  const peerPort = parseInt(
    process.env.NEXT_PUBLIC_PEERJS_PORT || (isDevelopment ? "9000" : "443")
  );

  const isSecure =
    process.env.NEXT_PUBLIC_PEERJS_SECURE === "true" ||
    (!isDevelopment && peerPort === 443);

  const config = {
    host: peerHost,
    port: peerPort,
    secure: isSecure,
    // path: "/peerjs",
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        // Add TURN servers for better connectivity in production
        ...(isDevelopment
          ? []
          : [
              {
                urls: "turn:openrelay.metered.ca:80",
                username: "openrelayproject",
                credential: "openrelayproject",
              },
              {
                urls: "turn:openrelay.metered.ca:443",
                username: "openrelayproject",
                credential: "openrelayproject",
              },
            ]),
      ],
    },
  };

  console.log("🔧 PeerJS Config:", {
    ...config,
    environment: isDevelopment ? "development" : "production",
    config: {
      ...config.config,
      iceServers: config.config.iceServers.map((server) => ({
        ...server,
        credential: server.credential ? "[HIDDEN]" : undefined,
      })),
    },
  });

  return config;
};
