/**
 * Aggressive WebSocket Cleanup Tool
 * This tool uses multiple methods to find and clean up WebSocket connections
 */

(function () {
  console.log("🔥 Aggressive WebSocket Cleanup Tool");

  let cleanupCount = 0;

  // Method 1: Override WebSocket constructor to track all instances
  function trackWebSocketInstances() {
    console.log("🔍 Method 1: Tracking WebSocket instances...");

    if (!window._originalWebSocket) {
      window._originalWebSocket = WebSocket;
      window._trackedWebSockets = [];

      window.WebSocket = function (url, protocols) {
        const ws = new window._originalWebSocket(url, protocols);
        window._trackedWebSockets.push(ws);
        console.log(`   📝 Tracked new WebSocket: ${url}`);
        return ws;
      };

      // Copy static properties
      Object.setPrototypeOf(window.WebSocket, window._originalWebSocket);
      Object.defineProperty(window.WebSocket, "prototype", {
        value: window._originalWebSocket.prototype,
        writable: false,
      });
    }

    return window._trackedWebSockets || [];
  }

  // Method 2: Search through all global variables
  function searchGlobalVariables() {
    console.log("🔍 Method 2: Searching global variables...");

    const found = [];
    const searchKeys = [
      "ws",
      "wsConnection",
      "socket",
      "websocket",
      "connection",
      "wsManager",
      "wsRef",
      "socketRef",
      "connectionRef",
      "chatWs",
      "videoWs",
      "peerWs",
      "therapistWs",
      "userWs",
    ];

    searchKeys.forEach((key) => {
      if (window[key]) {
        if (window[key] instanceof WebSocket) {
          found.push({ name: key, ws: window[key] });
        } else if (typeof window[key] === "object") {
          // Search nested objects
          searchObjectForWebSockets(window[key], key, found);
        }
      }
    });

    return found;
  }

  // Method 3: Search through React component state
  function searchReactState() {
    console.log("🔍 Method 3: Searching React component state...");

    const found = [];

    try {
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        const reactHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

        if (reactHook.renderers) {
          reactHook.renderers.forEach((renderer, id) => {
            if (renderer.getFiberRoots) {
              const roots = renderer.getFiberRoots(1);
              roots.forEach((root) => {
                searchFiberForWebSockets(root.current, found);
              });
            }
          });
        }
      }
    } catch (error) {
      console.log("   ⚠️ Could not access React state:", error.message);
    }

    return found;
  }

  // Method 4: Search through all objects in memory
  function searchMemoryObjects() {
    console.log("🔍 Method 4: Searching memory objects...");

    const found = [];

    try {
      // This is a more aggressive search through all accessible objects
      const objectsToSearch = [
        window,
        document,
        navigator,
        location,
        history,
        localStorage,
        sessionStorage,
      ];

      objectsToSearch.forEach((obj) => {
        if (obj && typeof obj === "object") {
          searchObjectForWebSockets(obj, "global", found);
        }
      });
    } catch (error) {
      console.log("   ⚠️ Memory search failed:", error.message);
    }

    return found;
  }

  // Helper function to search objects for WebSocket instances
  function searchObjectForWebSockets(obj, path, found, depth = 0) {
    if (depth > 3) return; // Prevent infinite recursion

    try {
      if (obj && typeof obj === "object") {
        Object.keys(obj).forEach((key) => {
          try {
            const value = obj[key];

            if (value instanceof WebSocket) {
              found.push({
                name: `${path}.${key}`,
                ws: value,
                path: `${path}.${key}`,
              });
            } else if (value && typeof value === "object" && depth < 2) {
              searchObjectForWebSockets(
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

  // Helper function to search React fiber for WebSocket instances
  function searchFiberForWebSockets(fiber, found, depth = 0) {
    if (depth > 5) return; // Prevent infinite recursion

    if (!fiber) return;

    try {
      // Check memoized state
      if (fiber.memoizedState) {
        searchStateForWebSockets(fiber.memoizedState, "fiber-state", found);
      }

      // Check memoized props
      if (fiber.memoizedProps) {
        searchObjectForWebSockets(fiber.memoizedProps, "fiber-props", found);
      }

      // Check refs
      if (fiber.ref) {
        if (fiber.ref.current instanceof WebSocket) {
          found.push({
            name: "fiber-ref",
            ws: fiber.ref.current,
            path: "fiber-ref",
          });
        }
      }

      // Traverse children
      let child = fiber.child;
      while (child) {
        searchFiberForWebSockets(child, found, depth + 1);
        child = child.sibling;
      }
    } catch (error) {
      // Ignore access errors
    }
  }

  // Helper function to search state for WebSocket instances
  function searchStateForWebSockets(state, path, found, depth = 0) {
    if (depth > 3) return;

    if (!state) return;

    try {
      if (state instanceof WebSocket) {
        found.push({ name: path, ws: state, path: path });
      } else if (typeof state === "object") {
        Object.keys(state).forEach((key) => {
          if (state[key] instanceof WebSocket) {
            found.push({
              name: `${path}.${key}`,
              ws: state[key],
              path: `${path}.${key}`,
            });
          } else if (state[key] && typeof state[key] === "object") {
            searchStateForWebSockets(
              state[key],
              `${path}.${key}`,
              found,
              depth + 1
            );
          }
        });
      }

      if (state.next) {
        searchStateForWebSockets(state.next, `${path}.next`, found, depth + 1);
      }
    } catch (error) {
      // Ignore access errors
    }
  }

  // Function to clean up WebSocket connections
  function cleanupWebSockets(connections) {
    console.log("🧹 Cleaning up WebSocket connections...");

    let cleaned = 0;

    connections.forEach((conn) => {
      try {
        if (
          conn.ws &&
          (conn.ws.readyState === WebSocket.OPEN ||
            conn.ws.readyState === WebSocket.CONNECTING)
        ) {
          console.log(`   🔌 Closing: ${conn.name} (${conn.ws.url})`);
          conn.ws.close(1000, "Aggressive cleanup");
          cleaned++;
        }
      } catch (error) {
        console.log(`   ❌ Error closing ${conn.name}:`, error.message);
      }
    });

    return cleaned;
  }

  // Function to get ready state text
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

  // Main function to run aggressive cleanup
  function runAggressiveCleanup() {
    console.log("🚀 Running Aggressive WebSocket Cleanup...\n");

    // Track new instances
    const tracked = trackWebSocketInstances();

    // Search for existing connections
    const globalFound = searchGlobalVariables();
    const reactFound = searchReactState();
    const memoryFound = searchMemoryObjects();

    // Combine all found connections
    const allConnections = [
      ...tracked.map((ws) => ({ name: "tracked", ws: ws, path: "tracked" })),
      ...globalFound,
      ...reactFound,
      ...memoryFound,
    ];

    // Remove duplicates
    const uniqueConnections = [];
    const seen = new Set();

    allConnections.forEach((conn) => {
      if (conn.ws && !seen.has(conn.ws)) {
        seen.add(conn.ws);
        uniqueConnections.push(conn);
      }
    });

    console.log(
      `\n📊 Found ${uniqueConnections.length} unique WebSocket connections:`
    );

    if (uniqueConnections.length === 0) {
      console.log("   ❌ No WebSocket connections found");
      console.log("   💡 This could mean:");
      console.log("      - No WebSocket connections are active");
      console.log("      - Connections are in private/encrypted contexts");
      console.log("      - Browser security restrictions prevent access");
      return 0;
    }

    uniqueConnections.forEach((conn, index) => {
      console.log(`   ${index + 1}. ${conn.name}`);
      console.log(`      URL: ${conn.ws.url}`);
      console.log(`      State: ${getReadyStateText(conn.ws.readyState)}`);
      if (conn.path) {
        console.log(`      Path: ${conn.path}`);
      }
    });

    // Clean up connections
    const cleaned = cleanupWebSockets(uniqueConnections);

    console.log(`\n✅ Cleaned up ${cleaned} WebSocket connections`);

    return cleaned;
  }

  // Export functions for manual use
  window.aggressiveWebSocketCleanup = {
    run: runAggressiveCleanup,
    track: trackWebSocketInstances,
    searchGlobal: searchGlobalVariables,
    searchReact: searchReactState,
    searchMemory: searchMemoryObjects,
    cleanup: cleanupWebSockets,
  };

  // Auto-run the cleanup
  runAggressiveCleanup();

  console.log("\n🛠️ Available commands:");
  console.log(
    "- aggressiveWebSocketCleanup.run() - Run full aggressive cleanup"
  );
  console.log(
    "- aggressiveWebSocketCleanup.track() - Track WebSocket instances"
  );
  console.log(
    "- aggressiveWebSocketCleanup.searchGlobal() - Search global variables"
  );
  console.log(
    "- aggressiveWebSocketCleanup.searchReact() - Search React state"
  );
  console.log(
    "- aggressiveWebSocketCleanup.searchMemory() - Search memory objects"
  );
  console.log(
    "- aggressiveWebSocketCleanup.cleanup(connections) - Cleanup specific connections"
  );
})();

