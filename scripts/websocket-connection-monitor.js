/**
 * WebSocket Connection Monitor
 * This tool monitors WebSocket connections in real-time
 */

(function () {
  console.log("📊 WebSocket Connection Monitor");

  let connectionCount = 0;
  let connections = [];

  // Override WebSocket constructor to monitor all connections
  if (!window._originalWebSocket) {
    window._originalWebSocket = WebSocket;

    window.WebSocket = function (url, protocols) {
      const ws = new window._originalWebSocket(url, protocols);
      connectionCount++;

      const connectionInfo = {
        id: connectionCount,
        url: url,
        ws: ws,
        createdAt: new Date(),
        state: ws.readyState,
      };

      connections.push(connectionInfo);

      console.log(`🔌 WebSocket #${connectionCount} created: ${url}`);
      console.log(`   State: ${getReadyStateText(ws.readyState)}`);
      console.log(`   Total connections: ${connections.length}`);

      // Monitor state changes
      ws.addEventListener("open", () => {
        connectionInfo.state = ws.readyState;
        console.log(`✅ WebSocket #${connectionInfo.id} opened: ${url}`);
      });

      ws.addEventListener("close", () => {
        connectionInfo.state = ws.readyState;
        console.log(`❌ WebSocket #${connectionInfo.id} closed: ${url}`);
      });

      ws.addEventListener("error", (error) => {
        console.log(`⚠️ WebSocket #${connectionInfo.id} error: ${url}`, error);
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

  // Function to get connection statistics
  function getConnectionStats() {
    const stats = {
      total: connections.length,
      connecting: 0,
      open: 0,
      closing: 0,
      closed: 0,
    };

    connections.forEach((conn) => {
      switch (conn.ws.readyState) {
        case WebSocket.CONNECTING:
          stats.connecting++;
          break;
        case WebSocket.OPEN:
          stats.open++;
          break;
        case WebSocket.CLOSING:
          stats.closing++;
          break;
        case WebSocket.CLOSED:
          stats.closed++;
          break;
      }
    });

    return stats;
  }

  // Function to display current connections
  function displayConnections() {
    const stats = getConnectionStats();

    console.log("\n📊 Current WebSocket Connections:");
    console.log(`   Total: ${stats.total}`);
    console.log(`   Connecting: ${stats.connecting}`);
    console.log(`   Open: ${stats.open}`);
    console.log(`   Closing: ${stats.closing}`);
    console.log(`   Closed: ${stats.closed}`);

    if (connections.length > 0) {
      console.log("\n📋 Connection Details:");
      connections.forEach((conn, index) => {
        const age = Math.round((new Date() - conn.createdAt) / 1000);
        console.log(`   ${index + 1}. #${conn.id} - ${conn.url}`);
        console.log(`      State: ${getReadyStateText(conn.ws.readyState)}`);
        console.log(`      Age: ${age}s`);
      });
    }

    return stats;
  }

  // Function to clean up all connections
  function cleanupAllConnections() {
    console.log("🧹 Cleaning up all monitored connections...");

    let cleaned = 0;
    connections.forEach((conn) => {
      try {
        if (
          conn.ws.readyState === WebSocket.OPEN ||
          conn.ws.readyState === WebSocket.CONNECTING
        ) {
          console.log(`   🔌 Closing #${conn.id}: ${conn.url}`);
          conn.ws.close(1000, "Monitor cleanup");
          cleaned++;
        }
      } catch (error) {
        console.log(`   ❌ Error closing #${conn.id}:`, error.message);
      }
    });

    console.log(`✅ Cleaned up ${cleaned} connections`);
    return cleaned;
  }

  // Function to reset the monitor
  function resetMonitor() {
    console.log("🔄 Resetting WebSocket monitor...");
    connections = [];
    connectionCount = 0;
    console.log("✅ Monitor reset");
  }

  // Auto-display current connections
  displayConnections();

  // Export functions for manual use
  window.webSocketMonitor = {
    stats: getConnectionStats,
    display: displayConnections,
    cleanup: cleanupAllConnections,
    reset: resetMonitor,
    connections: () => connections,
  };

  console.log("\n🛠️ Available commands:");
  console.log("- webSocketMonitor.display() - Display current connections");
  console.log("- webSocketMonitor.stats() - Get connection statistics");
  console.log("- webSocketMonitor.cleanup() - Clean up all connections");
  console.log("- webSocketMonitor.reset() - Reset the monitor");
  console.log("- webSocketMonitor.connections() - Get all connections");

  console.log(
    "\n💡 The monitor is now active and will track all new WebSocket connections."
  );
  console.log(
    "💡 Try creating a WebSocket connection to see it appear in the monitor."
  );
})();









