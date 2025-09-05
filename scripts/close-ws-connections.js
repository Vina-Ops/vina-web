/**
 * Quick WebSocket Connection Cleanup
 * Copy and paste this into your browser console to immediately close all WebSocket connections
 */

// Quick cleanup function
(function closeAllWebSockets() {
  console.log("🚨 QUICK WEBSOCKET CLEANUP STARTING...");

  let closed = 0;

  // Close common global WebSocket variables
  [
    "wsConnection",
    "ws",
    "socket",
    "connection",
    "websocket",
    "chatSocket",
    "therapistSocket",
  ].forEach((name) => {
    if (
      window[name] &&
      (window[name].readyState === 1 || window[name].readyState === 0)
    ) {
      console.log(`🔌 Closing ${name}`);
      window[name].close(1000, "Quick cleanup");
      closed++;
    }
  });

  console.log(`✅ Closed ${closed} WebSocket connections`);

  // Block new connections for 30 seconds
  if (!window._originalWS) {
    window._originalWS = WebSocket;
    window.WebSocket = function () {
      console.warn("🚫 New WebSocket blocked by cleanup");
      throw new Error("WebSocket temporarily disabled");
    };

    setTimeout(() => {
      window.WebSocket = window._originalWS;
      delete window._originalWS;
      console.log("✅ WebSocket functionality restored");
    }, 30000);
  }

  return closed;
})();


