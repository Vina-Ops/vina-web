// PeerJS Configuration for Development and Production
export const getPeerConfig = () => {
  // Determine if we're in development or production
  const isDevelopment = process.env.NODE_ENV === "development";

  // Get configuration from environment variables with fallbacks
  const peerHost =
    process.env.NEXT_PUBLIC_PEERJS_HOST ||
    (isDevelopment ? "localhost" : "0.peerjs.com");

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

    config: {
      iceServers: [
        // Google STUN servers (most reliable)
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },

        // Reliable public STUN servers
        { urls: "stun:stun.stunprotocol.org:3478" },
        { urls: "stun:stun.voiparound.com" },
        { urls: "stun:stun.voipbuster.com" },
        { urls: "stun:stun.voipstunt.com" },
        { urls: "stun:stun.counterpath.com" },
        { urls: "stun:stun.1und1.de" },
        { urls: "stun:stun.gmx.net" },

        // Cloudflare STUN servers (very reliable)
        { urls: "stun:stun.cloudflare.com:3478" },

        // Additional reliable servers
        { urls: "stun:stun.nextcloud.com:443" },
        { urls: "stun:stun.voip.blackberry.com:3478" },

        // TURN servers for NAT traversal (always include for better connectivity)
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
        // Additional free TURN servers
        {
          urls: "turn:relay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:relay.metered.ca:443",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
      // Enhanced ICE configuration
      iceCandidatePoolSize: 10,
      iceTransportPolicy: "all", // Try both relay and host candidates
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require",
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
