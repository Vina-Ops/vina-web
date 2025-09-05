/**
 * Ultra Aggressive WebSocket Monitor
 * This tool is designed to catch WebSocket connections that are created and destroyed rapidly
 */

(function () {
  console.log("🔥 ULTRA AGGRESSIVE WebSocket Monitor");

  let connectionCount = 0;
  let allConnections = [];
  let rapidConnections = [];
  let originalWebSocket = null;
  let isMonitoring = false;

  // Override WebSocket constructor IMMEDIATELY
  function startUltraMonitoring() {
    if (isMonitoring) {
      console.log("⚠️ Ultra monitoring already active");
      return;
    }

    console.log("🚀 Starting ULTRA AGGRESSIVE WebSocket monitoring...");

    if (!originalWebSocket) {
      originalWebSocket = WebSocket;

      window.WebSocket = function (url, protocols) {
        const ws = new originalWebSocket(url, protocols);
        connectionCount++;

        const connectionInfo = {
          id: connectionCount,
          url: url,
          ws: ws,
          createdAt: new Date(),
          state: ws.readyState,
          rapid: false,
          destroyed: false,
        };

        allConnections.push(connectionInfo);

        console.log(`🔌 WebSocket #${connectionCount} CREATED: ${url}`);
        console.log(`   State: ${getReadyStateText(ws.readyState)}`);
        console.log(`   Total tracked: ${allConnections.length}`);

        // Track rapid connections (created and destroyed quickly)
        const rapidTimeout = setTimeout(() => {
          if (!connectionInfo.destroyed) {
            connectionInfo.rapid = false;
          }
        }, 1000); // Mark as rapid if destroyed within 1 second

        // Monitor ALL events
        ws.addEventListener("open", () => {
          connectionInfo.state = ws.readyState;
          console.log(`✅ WebSocket #${connectionInfo.id} OPENED: ${url}`);
          logConnectionStats();
        });

        ws.addEventListener("close", (event) => {
          connectionInfo.state = ws.readyState;
          connectionInfo.destroyed = true;
          connectionInfo.closedAt = new Date();
          connectionInfo.closeCode = event.code;
          connectionInfo.closeReason = event.reason;

          const lifespan = connectionInfo.closedAt - connectionInfo.createdAt;

          if (lifespan < 1000) {
            connectionInfo.rapid = true;
            rapidConnections.push(connectionInfo);
            console.log(
              `⚡ RAPID WebSocket #${connectionInfo.id} CLOSED: ${url} (${lifespan}ms)`
            );
            console.log(
              `   Close code: ${event.code}, Reason: ${event.reason}`
            );
          } else {
            console.log(
              `❌ WebSocket #${connectionInfo.id} CLOSED: ${url} (${lifespan}ms)`
            );
          }

          logConnectionStats();
        });

        ws.addEventListener("error", (error) => {
          connectionInfo.error = error;
          console.log(
            `⚠️ WebSocket #${connectionInfo.id} ERROR: ${url}`,
            error
          );
          logConnectionStats();
        });

        // Override close method to track manual closes
        const originalClose = ws.close.bind(ws);
        ws.close = function (code, reason) {
          console.log(
            `🔧 WebSocket #${connectionInfo.id} MANUALLY CLOSED: ${url} (${code}, ${reason})`
          );
          return originalClose(code, reason);
        };

        return ws;
      };

      // Copy static properties
      Object.setPrototypeOf(window.WebSocket, originalWebSocket);
      Object.defineProperty(window.WebSocket, "prototype", {
        value: originalWebSocket.prototype,
        writable: false,
      });
    }

    isMonitoring = true;
    console.log(
      "✅ Ultra monitoring started - will catch ALL WebSocket activity"
    );

    // Start periodic scanning for hidden connections
    startPeriodicScanning();
  }

  // Periodic scanning for connections that might be missed
  function startPeriodicScanning() {
    setInterval(() => {
      scanForHiddenConnections();
    }, 2000); // Scan every 2 seconds
  }

  // Scan for WebSocket connections that might be hidden
  function scanForHiddenConnections() {
    const found = [];

    // Method 1: Check all global variables
    Object.keys(window).forEach((key) => {
      try {
        if (window[key] instanceof WebSocket) {
          found.push({ name: key, ws: window[key], source: "global" });
        }
      } catch (e) {
        // Ignore access errors
      }
    });

    // Method 2: Check React state more aggressively
    try {
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        const reactHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (reactHook.renderers) {
          reactHook.renderers.forEach((renderer, id) => {
            if (renderer.getFiberRoots) {
              const roots = renderer.getFiberRoots(1);
              roots.forEach((root) => {
                scanFiberForWebSockets(root.current, found);
              });
            }
          });
        }
      }
    } catch (error) {
      // Ignore errors
    }

    // Method 3: Check for WebSocket instances in memory
    if (window._trackedWebSockets) {
      window._trackedWebSockets.forEach((ws, index) => {
        found.push({ name: `tracked-${index}`, ws: ws, source: "tracked" });
      });
    }

    // Report new findings
    found.forEach((conn) => {
      const alreadyTracked = allConnections.some((c) => c.ws === conn.ws);
      if (!alreadyTracked) {
        console.log(
          `🔍 HIDDEN WebSocket found: ${conn.name} (${conn.ws.url}) - ${conn.source}`
        );
        console.log(`   State: ${getReadyStateText(conn.ws.readyState)}`);
      }
    });
  }

  // Scan React fiber for WebSocket instances
  function scanFiberForWebSockets(fiber, found, depth = 0) {
    if (depth > 10) return; // Prevent infinite recursion

    if (!fiber) return;

    try {
      // Check memoized state
      if (fiber.memoizedState) {
        scanStateForWebSockets(fiber.memoizedState, "fiber-state", found);
      }

      // Check memoized props
      if (fiber.memoizedProps) {
        scanObjectForWebSockets(fiber.memoizedProps, "fiber-props", found);
      }

      // Check refs
      if (fiber.ref && fiber.ref.current instanceof WebSocket) {
        found.push({
          name: "fiber-ref",
          ws: fiber.ref.current,
          source: "react-ref",
        });
      }

      // Traverse children
      let child = fiber.child;
      while (child) {
        scanFiberForWebSockets(child, found, depth + 1);
        child = child.sibling;
      }
    } catch (error) {
      // Ignore access errors
    }
  }

  // Scan state for WebSocket instances
  function scanStateForWebSockets(state, path, found, depth = 0) {
    if (depth > 5) return;

    if (!state) return;

    try {
      if (state instanceof WebSocket) {
        found.push({ name: path, ws: state, source: "react-state" });
      } else if (typeof state === "object") {
        Object.keys(state).forEach((key) => {
          if (state[key] instanceof WebSocket) {
            found.push({
              name: `${path}.${key}`,
              ws: state[key],
              source: "react-state",
            });
          } else if (state[key] && typeof state[key] === "object") {
            scanStateForWebSockets(
              state[key],
              `${path}.${key}`,
              found,
              depth + 1
            );
          }
        });
      }

      if (state.next) {
        scanStateForWebSockets(state.next, `${path}.next`, found, depth + 1);
      }
    } catch (error) {
      // Ignore access errors
    }
  }

  // Scan objects for WebSocket instances
  function scanObjectForWebSockets(obj, path, found, depth = 0) {
    if (depth > 3) return;

    try {
      if (obj && typeof obj === "object") {
        Object.keys(obj).forEach((key) => {
          try {
            const value = obj[key];

            if (value instanceof WebSocket) {
              found.push({
                name: `${path}.${key}`,
                ws: value,
                source: "object",
              });
            } else if (value && typeof value === "object" && depth < 2) {
              scanObjectForWebSockets(
                value,
                `${path}.${key}`,
                found,
                depth + 1
              );
            }
          } catch (e) {
            // Ignore access errors
          }
        });
      }
    } catch (error) {
      // Ignore access errors
    }
  }

  // Helper functions
  function getReadyStateText(readyState) {
    switch (readyState) {
      case WebSocket.CONNECTING:
        return "CONNECTING";
      case WebSocket.OPEN:
        return "OPEN";
      case WebSocket.CLOSING:
        return "CLOSING";
      case WebSocket.CLOSED:
        return "CLOSED";
      default:
        return "UNKNOWN";
    }
  }

  function logConnectionStats() {
    const stats = {
      total: allConnections.length,
      active: allConnections.filter((c) => c.ws.readyState === WebSocket.OPEN)
        .length,
      connecting: allConnections.filter(
        (c) => c.ws.readyState === WebSocket.CONNECTING
      ).length,
      closed: allConnections.filter((c) => c.ws.readyState === WebSocket.CLOSED)
        .length,
      rapid: rapidConnections.length,
    };

    console.log(
      `📊 Connection Stats: Total=${stats.total}, Active=${stats.active}, Connecting=${stats.connecting}, Closed=${stats.closed}, Rapid=${stats.rapid}`
    );
  }

  // Cleanup functions
  function cleanupAllConnections() {
    console.log("🧹 ULTRA CLEANUP: Closing ALL WebSocket connections...");

    let cleaned = 0;
    allConnections.forEach((conn) => {
      try {
        if (
          conn.ws.readyState === WebSocket.OPEN ||
          conn.ws.readyState === WebSocket.CONNECTING
        ) {
          console.log(`🔌 Force closing: ${conn.url}`);
          conn.ws.close(1000, "Ultra cleanup");
          cleaned++;
        }
      } catch (error) {
        console.log(`❌ Error closing ${conn.url}:`, error.message);
      }
    });

    console.log(`✅ Ultra cleanup completed: ${cleaned} connections closed`);
    return cleaned;
  }

  function cleanupRapidConnections() {
    console.log("⚡ Cleaning up rapid connections...");

    let cleaned = 0;
    rapidConnections.forEach((conn) => {
      try {
        if (
          conn.ws.readyState === WebSocket.OPEN ||
          conn.ws.readyState === WebSocket.CONNECTING
        ) {
          console.log(`🔌 Closing rapid connection: ${conn.url}`);
          conn.ws.close(1000, "Rapid cleanup");
          cleaned++;
        }
      } catch (error) {
        console.log(`❌ Error closing rapid connection:`, error.message);
      }
    });

    console.log(`✅ Rapid cleanup completed: ${cleaned} connections closed`);
    return cleaned;
  }

  function displayAllConnections() {
    console.log("\n📋 ALL TRACKED CONNECTIONS:");
    allConnections.forEach((conn, index) => {
      const age = conn.destroyed
        ? Math.round((conn.closedAt - conn.createdAt) / 1000)
        : Math.round((new Date() - conn.createdAt) / 1000);

      console.log(`${index + 1}. #${conn.id} - ${conn.url}`);
      console.log(`   State: ${getReadyStateText(conn.ws.readyState)}`);
      console.log(`   Age: ${age}s`);
      console.log(`   Rapid: ${conn.rapid ? "YES" : "NO"}`);
      if (conn.destroyed) {
        console.log(`   Closed: ${conn.closeCode} - ${conn.closeReason}`);
      }
    });

    if (rapidConnections.length > 0) {
      console.log("\n⚡ RAPID CONNECTIONS (created and destroyed quickly):");
      rapidConnections.forEach((conn, index) => {
        const lifespan = Math.round(conn.closedAt - conn.createdAt);
        console.log(`${index + 1}. ${conn.url} (${lifespan}ms lifespan)`);
      });
    }
  }

  function resetMonitor() {
    console.log("🔄 Resetting ultra monitor...");
    allConnections = [];
    rapidConnections = [];
    connectionCount = 0;
    isMonitoring = false;

    if (originalWebSocket) {
      window.WebSocket = originalWebSocket;
      originalWebSocket = null;
    }

    console.log("✅ Ultra monitor reset");
  }

  // Export functions
  window.ultraWebSocketMonitor = {
    start: startUltraMonitoring,
    cleanup: cleanupAllConnections,
    cleanupRapid: cleanupRapidConnections,
    display: displayAllConnections,
    reset: resetMonitor,
    stats: logConnectionStats,
    connections: () => allConnections,
    rapidConnections: () => rapidConnections,
  };

  // Auto-start monitoring
  startUltraMonitoring();

  console.log("\n🛠️ Available commands:");
  console.log("- ultraWebSocketMonitor.start() - Start ultra monitoring");
  console.log("- ultraWebSocketMonitor.cleanup() - Cleanup all connections");
  console.log(
    "- ultraWebSocketMonitor.cleanupRapid() - Cleanup rapid connections"
  );
  console.log("- ultraWebSocketMonitor.display() - Display all connections");
  console.log("- ultraWebSocketMonitor.reset() - Reset monitor");
  console.log("- ultraWebSocketMonitor.stats() - Show connection stats");
  console.log("- ultraWebSocketMonitor.connections() - Get all connections");
  console.log(
    "- ultraWebSocketMonitor.rapidConnections() - Get rapid connections"
  );
})();

