// WebSocket configuration utilities

export const getWebSocketUrl = (endpoint: string = "/api/vina"): string => {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
  const devUrl = process.env.NEXT_PUBLIC_API_URL;
  const prodUrl = process.env.NEXT_PUBLIC_API_URL_PROD;

  // console.log("🌐 WebSocket config:", {
  //   environment,
  //   devUrl,
  //   prodUrl,
  //   endpoint,
  // });

  const baseUrl = environment === "development" ? devUrl : prodUrl;

  if (!baseUrl) {
    console.warn("No API URL configured, using fallback");
    return `wss://vina-ai.onrender.com${endpoint}`;
  }

  // Convert HTTP/HTTPS to WSS
  const wsUrl = baseUrl.replace(/^https?:\/\//, "wss://");
  const finalUrl = `${wsUrl}${endpoint}`;

  // console.log("🌐 WebSocket URL:", finalUrl);
  return finalUrl;
};

export const WEBSOCKET_CONFIG = {
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  heartbeatInterval: 30000, // 30 seconds
  connectionTimeout: 10000, // 10 seconds
};

export const isWebSocketSupported = (): boolean => {
  return typeof window !== "undefined" && "WebSocket" in window;
};
