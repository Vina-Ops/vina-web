/**
 * Connection Recovery Script
 * Run this in your browser console to recover from connection issues
 */

(function () {
  console.log("🔄 Starting Connection Recovery...");

  // Function to check and recover WebSocket connections
  function recoverWebSocketConnections() {
    console.log("🔍 Checking WebSocket connections...");

    // Check for WebSocket manager
    if (window.wsManager) {
      const stats = window.wsManager.getStats();
      console.log("📊 WebSocket Manager Stats:", stats);

      if (stats.reconnecting > 0) {
        console.log(
          "🔄 Found reconnecting connections, waiting for recovery..."
        );
        return;
      }

      if (stats.active === 0 && stats.total > 0) {
        console.log("⚠️ No active connections found, attempting to recover...");
        // Force close all connections and let them reconnect
        window.wsManager.closeAllConnections("Recovery script");
      }
    }

    // Check for global WebSocket variables
    const globalVars = ["wsConnection", "ws", "socket", "connection"];
    let foundConnections = 0;

    globalVars.forEach((varName) => {
      if (window[varName]) {
        const ws = window[varName];
        if (
          ws.readyState === WebSocket.CLOSED ||
          ws.readyState === WebSocket.CLOSING
        ) {
          console.log(`🔌 Found closed connection: ${varName}`);
          foundConnections++;
        } else if (ws.readyState === WebSocket.OPEN) {
          console.log(`✅ Found active connection: ${varName}`);
        }
      }
    });

    if (foundConnections > 0) {
      console.log(`🔄 Found ${foundConnections} closed connections`);
    }
  }

  // Function to check PeerJS connection
  function recoverPeerJSConnection() {
    console.log("🔍 Checking PeerJS connection...");

    // Check if PeerJS is available
    if (typeof Peer !== "undefined") {
      console.log("✅ PeerJS library is available");
    } else {
      console.log("❌ PeerJS library not found");
    }

    // Check for peer instances in global scope
    const peerVars = ["peer", "peerRef", "currentPeer"];
    peerVars.forEach((varName) => {
      if (window[varName]) {
        const peer = window[varName];
        if (peer && typeof peer.destroy === "function") {
          console.log(`🔍 Found peer instance: ${varName}`);
          if (peer.destroyed) {
            console.log(`❌ Peer ${varName} is destroyed`);
          } else if (peer.open) {
            console.log(`✅ Peer ${varName} is open`);
          } else {
            console.log(`⚠️ Peer ${varName} is not open`);
          }
        }
      }
    });
  }

  // Function to check network connectivity
  function checkNetworkConnectivity() {
    console.log("🔍 Checking network connectivity...");

    if (navigator.onLine) {
      console.log("✅ Browser reports online");
    } else {
      console.log("❌ Browser reports offline");
    }

    // Test basic connectivity
    fetch("/api/health", { method: "HEAD" })
      .then(() => {
        console.log("✅ Server is reachable");
      })
      .catch((error) => {
        console.log("❌ Server is not reachable:", error.message);
      });
  }

  // Function to provide recovery recommendations
  function provideRecoveryRecommendations() {
    console.log("💡 Recovery Recommendations:");
    console.log(
      "1. If WebSocket connections are closed, try refreshing the page"
    );
    console.log(
      "2. If PeerJS is destroyed, the video call system will reinitialize automatically"
    );
    console.log("3. If server is unreachable, check your internet connection");
    console.log("4. If issues persist, try clearing browser cache and cookies");
    console.log("5. For immediate recovery, run: location.reload()");
  }

  // Main recovery function
  function performRecovery() {
    console.log("🚀 Starting comprehensive connection recovery...");

    recoverWebSocketConnections();
    recoverPeerJSConnection();
    checkNetworkConnectivity();
    provideRecoveryRecommendations();

    console.log("✅ Connection recovery analysis complete");
    console.log("🔄 If issues persist, try refreshing the page");
  }

  // Auto-run recovery
  performRecovery();

  // Export functions for manual use
  window.connectionRecovery = {
    recover: performRecovery,
    checkWebSockets: recoverWebSocketConnections,
    checkPeerJS: recoverPeerJSConnection,
    checkNetwork: checkNetworkConnectivity,
    refresh: () => location.reload(),
    closeAllConnections: () => {
      if (window.wsManager) {
        window.wsManager.closeAllConnections("Manual cleanup");
      }
      console.log(
        "🧹 All connections closed, they will reconnect automatically"
      );
    },
  };

  console.log("🛠️ Available commands:");
  console.log("- connectionRecovery.recover() - Run full recovery");
  console.log(
    "- connectionRecovery.checkWebSockets() - Check WebSocket status"
  );
  console.log("- connectionRecovery.checkPeerJS() - Check PeerJS status");
  console.log("- connectionRecovery.checkNetwork() - Check network status");
  console.log("- connectionRecovery.refresh() - Refresh the page");
  console.log(
    "- connectionRecovery.closeAllConnections() - Close all connections"
  );
})();

