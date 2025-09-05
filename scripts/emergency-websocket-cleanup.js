/**
 * Emergency WebSocket Cleanup Script
 * Run this in your browser console to immediately close all WebSocket connections
 */

(function () {
  console.log("🚨 EMERGENCY WEBSOCKET CLEANUP STARTING...");

  let closedCount = 0;

  // Method 1: Close connections in common global variables
  const globalVars = [
    "wsConnection",
    "ws",
    "socket",
    "connection",
    "websocket",
    "chatSocket",
    "therapistSocket",
    "userSocket",
    "sessionSocket",
  ];

  globalVars.forEach((varName) => {
    if (window[varName]) {
      try {
        if (
          window[varName].readyState === WebSocket.OPEN ||
          window[varName].readyState === WebSocket.CONNECTING
        ) {
          console.log(`🔌 Closing global WebSocket: ${varName}`);
          window[varName].close(1000, "Emergency cleanup");
          closedCount++;
        }
      } catch (e) {
        console.log(`❌ Error closing ${varName}:`, e);
      }
    }
  });

  // Method 2: Close connections stored in React state (if accessible)
  try {
    // This is a more aggressive approach that tries to access React internals
    const reactRoots = document.querySelectorAll(
      "[data-reactroot], #__next, #root"
    );
    reactRoots.forEach((root) => {
      const reactInstance =
        root._reactInternalFiber || root._reactInternalInstance;
      if (reactInstance) {
        console.log(
          "🔍 Found React instance, attempting to close WebSocket connections..."
        );
        // This would require more complex traversal of React's internal state
      }
    });
  } catch (e) {
    console.log("ℹ️ Could not access React internals:", e.message);
  }

  // Method 3: Override WebSocket to prevent new connections temporarily
  if (!window._originalWebSocket) {
    window._originalWebSocket = WebSocket;
    console.log("🚫 Temporarily blocking new WebSocket connections...");

    window.WebSocket = function () {
      console.warn("🚫 New WebSocket connection blocked by emergency cleanup");
      throw new Error("WebSocket connections temporarily disabled");
    };

    // Restore after 10 seconds
    setTimeout(() => {
      if (window._originalWebSocket) {
        window.WebSocket = window._originalWebSocket;
        console.log("✅ WebSocket functionality restored");
      }
    }, 10000);
  }

  // Method 4: Force close any WebSocket connections we can find
  const allElements = document.querySelectorAll("*");
  allElements.forEach((element) => {
    // Check if element has WebSocket connections in its properties
    for (const prop in element) {
      try {
        if (
          element[prop] &&
          typeof element[prop] === "object" &&
          element[prop].readyState !== undefined
        ) {
          if (
            element[prop].readyState === WebSocket.OPEN ||
            element[prop].readyState === WebSocket.CONNECTING
          ) {
            console.log(`🔌 Found WebSocket in element property: ${prop}`);
            element[prop].close(1000, "Emergency cleanup");
            closedCount++;
          }
        }
      } catch (e) {
        // Ignore errors when checking properties
      }
    }
  });

  // Method 5: Clear any WebSocket-related timers or intervals
  const highestTimeoutId = setTimeout(() => {}, 0);
  for (let i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i);
  }

  const highestIntervalId = setInterval(() => {}, 0);
  for (let i = 0; i < highestIntervalId; i++) {
    clearInterval(i);
  }

  console.log(
    `✅ EMERGENCY CLEANUP COMPLETED - Closed ${closedCount} WebSocket connections`
  );
  console.log("🚫 New WebSocket connections are blocked for 10 seconds");
  console.log("🔄 WebSocket functionality will be restored automatically");

  // Return cleanup functions for manual use
  window.emergencyCleanup = {
    closeAll: () => {
      console.log("🧹 Manual cleanup triggered...");
      // Re-run the cleanup
      location.reload(); // Nuclear option - reload the page
    },
    restore: () => {
      if (window._originalWebSocket) {
        window.WebSocket = window._originalWebSocket;
        console.log("✅ WebSocket functionality manually restored");
      }
    },
    status: () => {
      console.log("📊 Current WebSocket Status:");
      globalVars.forEach((varName) => {
        if (window[varName]) {
          console.log(
            `${varName}: ${window[varName].readyState} - ${
              window[varName].url || "No URL"
            }`
          );
        }
      });
    },
  };

  console.log("🛠️ Available commands:");
  console.log(
    "- emergencyCleanup.closeAll() - Force close all and reload page"
  );
  console.log("- emergencyCleanup.restore() - Restore WebSocket functionality");
  console.log("- emergencyCleanup.status() - Check current WebSocket status");
})();


