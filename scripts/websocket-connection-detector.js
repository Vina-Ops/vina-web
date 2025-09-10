/**
 * WebSocket Connection Detector & Cleanup Tool
 * This tool detects and cleans up WebSocket connections more effectively
 */

(function () {
  console.log("🔍 WebSocket Connection Detector & Cleanup Tool");

  // Function to detect WebSocket connections
  function detectWebSocketConnections() {
    console.log("🔍 Detecting WebSocket connections...");

    const connections = [];

    // Method 1: Check global variables
    const globalVars = [
      "ws",
      "wsConnection",
      "socket",
      "websocket",
      "connection",
    ];
    globalVars.forEach((varName) => {
      if (window[varName] && window[varName] instanceof WebSocket) {
        const ws = window[varName];
        connections.push({
          name: varName,
          url: ws.url,
          readyState: ws.readyState,
          readyStateText: getReadyStateText(ws.readyState),
          object: ws,
        });
      }
    });

    // Method 2: Check React component state (if accessible)
    try {
      // Try to access React DevTools
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        console.log(
          "   🔍 React DevTools detected, checking component state..."
        );

        // This is a more advanced detection method
        const reactHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (reactHook.renderers) {
          reactHook.renderers.forEach((renderer, id) => {
            if (renderer.getFiberRoots) {
              const roots = renderer.getFiberRoots(1);
              roots.forEach((root) => {
                // Traverse React fiber tree to find WebSocket connections
                traverseFiberForWebSockets(root.current, connections);
              });
            }
          });
        }
      }
    } catch (error) {
      console.log("   ⚠️ Could not access React DevTools:", error.message);
    }

    // Method 3: Check for WebSocket instances in memory
    try {
      // Override WebSocket constructor to track instances
      if (!window._originalWebSocket) {
        window._originalWebSocket = WebSocket;
        window._websocketInstances = [];

        window.WebSocket = function (url, protocols) {
          const ws = new window._originalWebSocket(url, protocols);
          window._websocketInstances.push({
            url: url,
            readyState: ws.readyState,
            readyStateText: getReadyStateText(ws.readyState),
            object: ws,
            createdAt: new Date(),
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

      // Check tracked instances
      if (window._websocketInstances) {
        window._websocketInstances.forEach((instance, index) => {
          connections.push({
            name: `Tracked-${index}`,
            url: instance.url,
            readyState: instance.object.readyState,
            readyStateText: getReadyStateText(instance.object.readyState),
            object: instance.object,
            createdAt: instance.createdAt,
          });
        });
      }
    } catch (error) {
      console.log("   ⚠️ Could not track WebSocket instances:", error.message);
    }

    return connections;
  }

  // Helper function to traverse React fiber tree
  function traverseFiberForWebSockets(fiber, connections) {
    if (!fiber) return;

    // Check if this fiber has WebSocket-related state
    if (fiber.memoizedState) {
      checkStateForWebSockets(fiber.memoizedState, connections);
    }

    // Check props
    if (fiber.memoizedProps) {
      checkPropsForWebSockets(fiber.memoizedProps, connections);
    }

    // Traverse children
    let child = fiber.child;
    while (child) {
      traverseFiberForWebSockets(child, connections);
      child = child.sibling;
    }
  }

  // Helper function to check state for WebSocket connections
  function checkStateForWebSockets(state, connections) {
    if (!state) return;

    // Check if state is a WebSocket
    if (state instanceof WebSocket) {
      connections.push({
        name: "React-State-WebSocket",
        url: state.url,
        readyState: state.readyState,
        readyStateText: getReadyStateText(state.readyState),
        object: state,
      });
    }

    // Check if state has WebSocket properties
    if (typeof state === "object") {
      Object.keys(state).forEach((key) => {
        if (state[key] instanceof WebSocket) {
          connections.push({
            name: `React-State-${key}`,
            url: state[key].url,
            readyState: state[key].readyState,
            readyStateText: getReadyStateText(state[key].readyState),
            object: state[key],
          });
        }
      });
    }

    // Recursively check nested state
    if (state.next) {
      checkStateForWebSockets(state.next, connections);
    }
  }

  // Helper function to check props for WebSocket connections
  function checkPropsForWebSockets(props, connections) {
    if (!props || typeof props !== "object") return;

    Object.keys(props).forEach((key) => {
      if (props[key] instanceof WebSocket) {
        connections.push({
          name: `React-Props-${key}`,
          url: props[key].url,
          readyState: props[key].readyState,
          readyStateText: getReadyStateText(props[key].readyState),
          object: props[key],
        });
      }
    });
  }

  // Helper function to get ready state text
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

  // Function to clean up WebSocket connections
  function cleanupWebSocketConnections(connections) {
    console.log("🧹 Cleaning up WebSocket connections...");

    let cleanedCount = 0;

    connections.forEach((conn) => {
      try {
        if (conn.object && conn.object.readyState === WebSocket.OPEN) {
          console.log(`   🔌 Closing connection: ${conn.name} (${conn.url})`);
          conn.object.close(1000, "Manual cleanup");
          cleanedCount++;
        } else if (
          conn.object &&
          conn.object.readyState === WebSocket.CONNECTING
        ) {
          console.log(`   🔌 Aborting connecting: ${conn.name} (${conn.url})`);
          conn.object.close(1000, "Manual cleanup");
          cleanedCount++;
        }
      } catch (error) {
        console.log(`   ❌ Error closing ${conn.name}:`, error.message);
      }
    });

    return cleanedCount;
  }

  // Function to display connection information
  function displayConnections(connections) {
    console.log("\n📊 WebSocket Connections Found:");

    if (connections.length === 0) {
      console.log("   ❌ No WebSocket connections detected");
      console.log("   💡 This could mean:");
      console.log("      - No WebSocket connections are active");
      console.log(
        "      - Connections are stored in variables we can't access"
      );
      console.log(
        "      - Connections are in React state that's not accessible"
      );
      return;
    }

    connections.forEach((conn, index) => {
      console.log(`   ${index + 1}. ${conn.name}`);
      console.log(`      URL: ${conn.url}`);
      console.log(`      State: ${conn.readyStateText} (${conn.readyState})`);
      if (conn.createdAt) {
        console.log(`      Created: ${conn.createdAt.toLocaleTimeString()}`);
      }
    });
  }

  // Main function to run the detector and cleanup
  function runWebSocketDetector() {
    console.log("🚀 Running WebSocket Connection Detector...\n");

    const connections = detectWebSocketConnections();
    displayConnections(connections);

    if (connections.length > 0) {
      console.log("\n🧹 Cleanup Options:");
      console.log(
        "   - Run cleanupWebSocketConnections() to close all connections"
      );
      console.log(
        "   - Run cleanupWebSocketConnections(connections) with specific connections"
      );

      // Auto-cleanup if there are many connections
      const openConnections = connections.filter(
        (conn) => conn.object && conn.object.readyState === WebSocket.OPEN
      );

      if (openConnections.length > 5) {
        console.log(
          `\n⚠️ Found ${openConnections.length} open connections. Auto-cleaning...`
        );
        const cleaned = cleanupWebSocketConnections(openConnections);
        console.log(`✅ Cleaned up ${cleaned} connections`);
      }
    }

    return connections;
  }

  // Export functions for manual use
  window.webSocketDetector = {
    detect: detectWebSocketConnections,
    cleanup: cleanupWebSocketConnections,
    display: displayConnections,
    run: runWebSocketDetector,
    getReadyStateText: getReadyStateText,
  };

  // Auto-run the detector
  runWebSocketDetector();

  console.log("\n🛠️ Available commands:");
  console.log("- webSocketDetector.run() - Run full detection and cleanup");
  console.log("- webSocketDetector.detect() - Detect connections only");
  console.log(
    "- webSocketDetector.cleanup() - Cleanup all detected connections"
  );
  console.log(
    "- webSocketDetector.display(connections) - Display connection info"
  );
})();





