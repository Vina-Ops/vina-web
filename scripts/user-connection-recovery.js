/**
 * User-Side Connection Recovery Script
 * Specifically designed to fix connection issues on the user side
 * Run this in your browser console when experiencing connection problems
 */

(function () {
  console.log("🔄 Starting User-Side Connection Recovery...");

  // Function to check user WebSocket connection
  function checkUserWebSocketConnection() {
    console.log("🔍 Checking user WebSocket connection...");

    // Look for user-specific WebSocket connections
    const userWsVars = ["wsConnection", "ws", "socket"];
    let userConnectionFound = false;

    userWsVars.forEach((varName) => {
      if (window[varName]) {
        const ws = window[varName];
        console.log(`🔍 Found user WebSocket: ${varName}`);
        console.log(
          `   State: ${ws.readyState} (${getWebSocketStateName(ws.readyState)})`
        );
        console.log(`   URL: ${ws.url || "Unknown"}`);

        if (ws.readyState === WebSocket.OPEN) {
          console.log(`✅ User WebSocket ${varName} is active`);
          userConnectionFound = true;
        } else if (
          ws.readyState === WebSocket.CLOSED ||
          ws.readyState === WebSocket.CLOSING
        ) {
          console.log(`❌ User WebSocket ${varName} is closed`);
        } else if (ws.readyState === WebSocket.CONNECTING) {
          console.log(`🔄 User WebSocket ${varName} is connecting...`);
        }
      }
    });

    if (!userConnectionFound) {
      console.log("⚠️ No active user WebSocket connections found");
    }

    return userConnectionFound;
  }

  // Function to check PeerJS connection for users
  function checkUserPeerJSConnection() {
    console.log("🔍 Checking user PeerJS connection...");

    // Check for PeerJS instances that might be user-specific
    const peerVars = ["peer", "peerRef", "currentPeer"];
    let peerFound = false;

    peerVars.forEach((varName) => {
      if (window[varName]) {
        const peer = window[varName];
        if (peer && typeof peer.destroy === "function") {
          console.log(`🔍 Found peer instance: ${varName}`);
          console.log(`   Destroyed: ${peer.destroyed}`);
          console.log(`   Open: ${peer.open}`);
          console.log(`   ID: ${peer.id || "No ID"}`);

          if (peer.open && !peer.destroyed) {
            console.log(`✅ Peer ${varName} is active`);
            peerFound = true;
          } else {
            console.log(`❌ Peer ${varName} is not active`);
          }
        }
      }
    });

    if (!peerFound) {
      console.log("⚠️ No active PeerJS connections found for user");
    }

    return peerFound;
  }

  // Function to check user authentication
  function checkUserAuthentication() {
    console.log("🔍 Checking user authentication...");

    // Check for user context
    if (window.user || window.userContext) {
      console.log("✅ User context found");
      return true;
    }

    // Check for tokens
    if (window.tokens || localStorage.getItem("tokens")) {
      console.log("✅ User tokens found");
      return true;
    }

    console.log("❌ No user authentication found");
    return false;
  }

  // Function to check chat room connection
  function checkChatRoomConnection() {
    console.log("🔍 Checking chat room connection...");

    // Check for chat room ID
    const url = window.location.href;
    const chatRoomMatch = url.match(/\/chat-room\/([^\/]+)/);

    if (chatRoomMatch) {
      const chatId = chatRoomMatch[1];
      console.log(`✅ Chat room ID found: ${chatId}`);
      return chatId;
    }

    console.log("❌ No chat room ID found in URL");
    return null;
  }

  // Function to attempt user connection recovery
  function attemptUserConnectionRecovery() {
    console.log("🔄 Attempting user connection recovery...");

    const hasAuth = checkUserAuthentication();
    const chatId = checkChatRoomConnection();
    const hasWsConnection = checkUserWebSocketConnection();
    const hasPeerConnection = checkUserPeerJSConnection();

    if (!hasAuth) {
      console.log("❌ Cannot recover - user not authenticated");
      console.log("💡 Please log in again");
      return false;
    }

    if (!chatId) {
      console.log("❌ Cannot recover - no chat room found");
      console.log("💡 Please navigate to a valid chat room");
      return false;
    }

    if (!hasWsConnection) {
      console.log(
        "🔄 WebSocket connection missing, attempting to reconnect..."
      );
      // Trigger page refresh to reinitialize connections
      console.log("💡 Refreshing page to reinitialize connections...");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return true;
    }

    if (!hasPeerConnection) {
      console.log(
        "🔄 PeerJS connection missing, will reinitialize automatically"
      );
      console.log("💡 Video calls may not work until PeerJS reconnects");
    }

    console.log("✅ User connection recovery completed");
    return true;
  }

  // Function to provide user-specific recommendations
  function provideUserRecommendations() {
    console.log("💡 User-Side Recovery Recommendations:");
    console.log("1. If you're experiencing connection issues:");
    console.log("   - Check your internet connection");
    console.log("   - Try refreshing the page");
    console.log("   - Clear browser cache and cookies");
    console.log("2. If messages aren't sending:");
    console.log("   - Check if you're still logged in");
    console.log("   - Verify you're in the correct chat room");
    console.log("3. If video calls aren't working:");
    console.log("   - Allow camera/microphone permissions");
    console.log("   - Check if PeerJS is connected");
    console.log("4. For immediate recovery:");
    console.log("   - Run: userRecovery.refresh()");
    console.log("   - Or manually refresh the page");
  }

  // Helper function to get WebSocket state name
  function getWebSocketStateName(readyState) {
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

  // Main recovery function
  function performUserRecovery() {
    console.log("🚀 Starting user-side connection recovery...");

    const recovered = attemptUserConnectionRecovery();
    provideUserRecommendations();

    if (recovered) {
      console.log("✅ User recovery process completed");
    } else {
      console.log("❌ User recovery failed - manual intervention required");
    }
  }

  // Auto-run recovery
  performUserRecovery();

  // Export functions for manual use
  window.userRecovery = {
    recover: performUserRecovery,
    checkWebSocket: checkUserWebSocketConnection,
    checkPeerJS: checkUserPeerJSConnection,
    checkAuth: checkUserAuthentication,
    checkChatRoom: checkChatRoomConnection,
    refresh: () => {
      console.log("🔄 Refreshing page for user recovery...");
      window.location.reload();
    },
    reconnect: () => {
      console.log("🔄 Attempting to reconnect user connections...");
      // Close existing connections
      const userWsVars = ["wsConnection", "ws", "socket"];
      userWsVars.forEach((varName) => {
        if (window[varName] && window[varName].readyState === WebSocket.OPEN) {
          window[varName].close();
        }
      });
      // Refresh after a short delay
      setTimeout(() => window.location.reload(), 1000);
    },
  };

  console.log("🛠️ Available user recovery commands:");
  console.log("- userRecovery.recover() - Run full user recovery");
  console.log("- userRecovery.checkWebSocket() - Check user WebSocket status");
  console.log("- userRecovery.checkPeerJS() - Check user PeerJS status");
  console.log("- userRecovery.checkAuth() - Check user authentication");
  console.log("- userRecovery.checkChatRoom() - Check chat room connection");
  console.log("- userRecovery.refresh() - Refresh page for recovery");
  console.log("- userRecovery.reconnect() - Force reconnect user connections");
})();

