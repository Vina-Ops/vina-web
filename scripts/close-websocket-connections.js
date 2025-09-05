/**
 * WebSocket Connection Cleanup Script
 * This script helps identify and close existing WebSocket connections
 */

// Function to close all WebSocket connections in the current window
function closeAllWebSocketConnections() {
  console.log("🧹 Starting WebSocket connection cleanup...");

  let closedCount = 0;

  // Method 1: Close connections stored in global variables
  const globalVars = ["wsConnection", "ws", "socket", "connection"];
  globalVars.forEach((varName) => {
    if (window[varName] && window[varName].readyState === WebSocket.OPEN) {
      console.log(`🔌 Closing global WebSocket: ${varName}`);
      window[varName].close(1000, "Script cleanup");
      closedCount++;
    }
  });

  // Method 2: Close connections stored in React state (if accessible)
  if (
    window.React &&
    window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
  ) {
    console.log(
      "🔍 Checking React component state for WebSocket connections..."
    );
    // This is a more advanced approach that would require access to React internals
  }

  // Method 3: Override WebSocket constructor to track connections
  if (!window._originalWebSocket) {
    window._originalWebSocket = WebSocket;
    window._activeConnections = new Set();

    window.WebSocket = function (...args) {
      const ws = new window._originalWebSocket(...args);
      window._activeConnections.add(ws);

      ws.addEventListener("close", () => {
        window._activeConnections.delete(ws);
      });

      return ws;
    };

    // Copy static properties
    Object.setPrototypeOf(window.WebSocket, window._originalWebSocket);
    Object.defineProperty(window.WebSocket, "prototype", {
      value: window._originalWebSocket.prototype,
      writable: false,
    });
  }

  // Close all tracked connections
  if (window._activeConnections) {
    window._activeConnections.forEach((ws) => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        console.log(`🔌 Closing tracked WebSocket: ${ws.url}`);
        ws.close(1000, "Script cleanup");
        closedCount++;
      }
    });
    window._activeConnections.clear();
  }

  console.log(`✅ Closed ${closedCount} WebSocket connections`);
  return closedCount;
}

// Function to monitor WebSocket connections
function monitorWebSocketConnections() {
  console.log("📊 WebSocket Connection Monitor");
  console.log("================================");

  if (window._activeConnections) {
    console.log(`Active connections: ${window._activeConnections.size}`);
    window._activeConnections.forEach((ws, index) => {
      console.log(`${index + 1}. ${ws.url} - State: ${ws.readyState}`);
    });
  } else {
    console.log("No connection tracking available");
  }

  // Check for connections in common global variables
  const globalVars = ["wsConnection", "ws", "socket", "connection"];
  globalVars.forEach((varName) => {
    if (window[varName]) {
      console.log(
        `${varName}: ${window[varName].readyState} - ${
          window[varName].url || "No URL"
        }`
      );
    }
  });
}

// Function to force close all connections (nuclear option)
function forceCloseAllConnections() {
  console.log("💥 Force closing all WebSocket connections...");

  // Close tracked connections
  if (window._activeConnections) {
    window._activeConnections.forEach((ws) => {
      try {
        ws.close(1000, "Force cleanup");
      } catch (e) {
        console.log("Error closing connection:", e);
      }
    });
    window._activeConnections.clear();
  }

  // Close global connections
  const globalVars = ["wsConnection", "ws", "socket", "connection"];
  globalVars.forEach((varName) => {
    if (window[varName]) {
      try {
        window[varName].close(1000, "Force cleanup");
        window[varName] = null;
      } catch (e) {
        console.log(`Error closing ${varName}:`, e);
      }
    }
  });

  console.log("✅ Force cleanup completed");
}

// Function to prevent new WebSocket connections
function preventNewConnections() {
  console.log("🚫 Preventing new WebSocket connections...");

  if (!window._originalWebSocket) {
    window._originalWebSocket = WebSocket;
  }

  window.WebSocket = function () {
    console.warn("🚫 New WebSocket connection blocked by cleanup script");
    throw new Error("WebSocket connections are currently disabled");
  };

  console.log("✅ New WebSocket connections are now blocked");
}

// Function to restore WebSocket functionality
function restoreWebSocketFunctionality() {
  console.log("🔄 Restoring WebSocket functionality...");

  if (window._originalWebSocket) {
    window.WebSocket = window._originalWebSocket;
    console.log("✅ WebSocket functionality restored");
  } else {
    console.log("❌ No original WebSocket found to restore");
  }
}

// Export functions to global scope for easy access
window.closeAllWebSocketConnections = closeAllWebSocketConnections;
window.monitorWebSocketConnections = monitorWebSocketConnections;
window.forceCloseAllConnections = forceCloseAllConnections;
window.preventNewConnections = preventNewConnections;
window.restoreWebSocketFunctionality = restoreWebSocketFunctionality;

// Auto-run cleanup on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 WebSocket Cleanup Script Loaded");
    console.log("Available commands:");
    console.log("- closeAllWebSocketConnections()");
    console.log("- monitorWebSocketConnections()");
    console.log("- forceCloseAllConnections()");
    console.log("- preventNewConnections()");
    console.log("- restoreWebSocketFunctionality()");
  });
} else {
  console.log("🚀 WebSocket Cleanup Script Loaded");
  console.log("Available commands:");
  console.log("- closeAllWebSocketConnections()");
  console.log("- monitorWebSocketConnections()");
  console.log("- forceCloseAllConnections()");
  console.log("- preventNewConnections()");
  console.log("- restoreWebSocketFunctionality()");
}

// Auto-cleanup on page unload
window.addEventListener("beforeunload", () => {
  closeAllWebSocketConnections();
});

// Periodic monitoring (every 30 seconds)
setInterval(() => {
  if (window._activeConnections && window._activeConnections.size > 0) {
    console.log(
      `📊 ${window._activeConnections.size} active WebSocket connections`
    );
  }
}, 30000);


