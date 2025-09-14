/**
 * WebSocket Connection Analyzer
 * This tool analyzes WebSocket connection patterns and identifies issues
 */

(function () {
  console.log("🔍 WebSocket Connection Analyzer");

  let connectionHistory = [];
  let originalWebSocket = null;
  let isAnalyzing = false;

  // Start analysis
  function startAnalysis() {
    if (isAnalyzing) {
      console.log("⚠️ Analysis already running");
      return;
    }

    console.log("🚀 Starting WebSocket connection analysis...");

    if (!originalWebSocket) {
      originalWebSocket = WebSocket;

      window.WebSocket = function (url, protocols) {
        const ws = new originalWebSocket(url, protocols);
        const connectionId =
          Date.now() + Math.random().toString(36).substr(2, 9);

        const connectionInfo = {
          id: connectionId,
          url: url,
          ws: ws,
          createdAt: new Date(),
          events: [],
          status: "created",
        };

        connectionHistory.push(connectionInfo);

        console.log(`🔌 WebSocket created: ${connectionId}`);
        console.log(`   URL: ${url}`);

        // Track all events
        const originalOnOpen = ws.onopen;
        const originalOnClose = ws.onclose;
        const originalOnError = ws.onerror;
        const originalOnMessage = ws.onmessage;

        ws.onopen = (event) => {
          connectionInfo.status = "open";
          connectionInfo.events.push({
            type: "open",
            timestamp: new Date(),
            data: event,
          });
          console.log(`✅ WebSocket ${connectionId} opened`);

          if (originalOnOpen) {
            originalOnOpen.call(ws, event);
          }
        };

        ws.onclose = (event) => {
          connectionInfo.status = "closed";
          connectionInfo.events.push({
            type: "close",
            timestamp: new Date(),
            data: {
              code: event.code,
              reason: event.reason,
              wasClean: event.wasClean,
            },
          });

          const lifespan = new Date() - connectionInfo.createdAt;
          console.log(
            `❌ WebSocket ${connectionId} closed: ${event.code} - ${event.reason} (lifespan: ${lifespan}ms)`
          );

          if (originalOnClose) {
            originalOnClose.call(ws, event);
          }
        };

        ws.onerror = (event) => {
          connectionInfo.status = "error";
          connectionInfo.events.push({
            type: "error",
            timestamp: new Date(),
            data: event,
          });
          console.log(`⚠️ WebSocket ${connectionId} error:`, event);

          if (originalOnError) {
            originalOnError.call(ws, event);
          }
        };

        ws.onmessage = (event) => {
          connectionInfo.events.push({
            type: "message",
            timestamp: new Date(),
            data: {
              size: event.data.length,
              type: typeof event.data,
            },
          });

          if (originalOnMessage) {
            originalOnMessage.call(ws, event);
          }
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

    isAnalyzing = true;
    console.log("✅ WebSocket analysis started");
  }

  // Stop analysis
  function stopAnalysis() {
    if (!isAnalyzing) {
      console.log("⚠️ Analysis not running");
      return;
    }

    console.log("🛑 Stopping WebSocket analysis...");

    if (originalWebSocket) {
      window.WebSocket = originalWebSocket;
      originalWebSocket = null;
    }

    isAnalyzing = false;
    console.log("✅ WebSocket analysis stopped");
  }

  // Analyze connection patterns
  function analyzeConnections() {
    console.log("\n📊 WebSocket Connection Analysis:");

    if (connectionHistory.length === 0) {
      console.log("   No connections recorded yet");
      return;
    }

    const analysis = {
      total: connectionHistory.length,
      byStatus: {},
      byUrl: {},
      rapidConnections: [],
      longLivedConnections: [],
      errorConnections: [],
      avgLifespan: 0,
      totalLifespan: 0,
    };

    // Analyze each connection
    connectionHistory.forEach((conn) => {
      // Status analysis
      analysis.byStatus[conn.status] =
        (analysis.byStatus[conn.status] || 0) + 1;

      // URL analysis
      analysis.byUrl[conn.url] = (analysis.byUrl[conn.url] || 0) + 1;

      // Lifespan analysis
      const lifespan = new Date() - conn.createdAt;
      analysis.totalLifespan += lifespan;

      if (lifespan < 1000) {
        analysis.rapidConnections.push({
          id: conn.id,
          url: conn.url,
          lifespan: lifespan,
          events: conn.events.length,
        });
      } else if (lifespan > 30000) {
        analysis.longLivedConnections.push({
          id: conn.id,
          url: conn.url,
          lifespan: lifespan,
          events: conn.events.length,
        });
      }

      // Error analysis
      const errorEvents = conn.events.filter((e) => e.type === "error");
      if (errorEvents.length > 0) {
        analysis.errorConnections.push({
          id: conn.id,
          url: conn.url,
          errors: errorEvents.length,
          lifespan: lifespan,
        });
      }
    });

    analysis.avgLifespan = analysis.totalLifespan / analysis.total;

    // Display analysis results
    console.log(`\n📈 Summary:`);
    console.log(`   Total Connections: ${analysis.total}`);
    console.log(`   Average Lifespan: ${Math.round(analysis.avgLifespan)}ms`);
    console.log(
      `   Rapid Connections (<1s): ${analysis.rapidConnections.length}`
    );
    console.log(
      `   Long-lived Connections (>30s): ${analysis.longLivedConnections.length}`
    );
    console.log(`   Error Connections: ${analysis.errorConnections.length}`);

    console.log(`\n📊 Status Distribution:`);
    Object.entries(analysis.byStatus).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

    console.log(`\n🌐 URL Distribution:`);
    Object.entries(analysis.byUrl).forEach(([url, count]) => {
      console.log(`   ${url}: ${count} connections`);
    });

    if (analysis.rapidConnections.length > 0) {
      console.log(`\n⚡ Rapid Connections (potential issues):`);
      analysis.rapidConnections.forEach((conn) => {
        console.log(
          `   ${conn.id}: ${conn.url} (${conn.lifespan}ms, ${conn.events.length} events)`
        );
      });
    }

    if (analysis.errorConnections.length > 0) {
      console.log(`\n❌ Error Connections:`);
      analysis.errorConnections.forEach((conn) => {
        console.log(
          `   ${conn.id}: ${conn.url} (${conn.errors} errors, ${conn.lifespan}ms)`
        );
      });
    }

    // Identify potential issues
    console.log(`\n🔍 Potential Issues:`);

    if (analysis.rapidConnections.length > 5) {
      console.log(
        `   ⚠️ High number of rapid connections (${analysis.rapidConnections.length}) - possible reconnection loop`
      );
    }

    if (analysis.errorConnections.length > 0) {
      console.log(
        `   ⚠️ ${analysis.errorConnections.length} connections with errors - check server/network issues`
      );
    }

    if (analysis.avgLifespan < 5000) {
      console.log(
        `   ⚠️ Low average connection lifespan (${Math.round(
          analysis.avgLifespan
        )}ms) - possible connection instability`
      );
    }

    const duplicateUrls = Object.entries(analysis.byUrl).filter(
      ([url, count]) => count > 1
    );
    if (duplicateUrls.length > 0) {
      console.log(
        `   ⚠️ Multiple connections to same URLs - possible connection pooling issues`
      );
      duplicateUrls.forEach(([url, count]) => {
        console.log(`      ${url}: ${count} connections`);
      });
    }

    return analysis;
  }

  // Get connection details
  function getConnectionDetails(connectionId) {
    const conn = connectionHistory.find((c) => c.id === connectionId);
    if (!conn) {
      console.log(`❌ Connection ${connectionId} not found`);
      return;
    }

    console.log(`\n🔍 Connection Details: ${connectionId}`);
    console.log(`   URL: ${conn.url}`);
    console.log(`   Status: ${conn.status}`);
    console.log(`   Created: ${conn.createdAt.toLocaleString()}`);
    console.log(`   Events: ${conn.events.length}`);

    conn.events.forEach((event, index) => {
      console.log(
        `   ${index + 1}. ${
          event.type
        } at ${event.timestamp.toLocaleTimeString()}`
      );
      if (event.data) {
        console.log(`      Data:`, event.data);
      }
    });
  }

  // Cleanup connections
  function cleanupConnections() {
    console.log("🧹 Cleaning up analyzed connections...");

    let cleaned = 0;
    connectionHistory.forEach((conn) => {
      try {
        if (
          conn.ws.readyState === WebSocket.OPEN ||
          conn.ws.readyState === WebSocket.CONNECTING
        ) {
          console.log(`🔌 Closing ${conn.id}`);
          conn.ws.close(1000, "Analysis cleanup");
          cleaned++;
        }
      } catch (error) {
        console.log(`❌ Error closing ${conn.id}:`, error.message);
      }
    });

    console.log(`✅ Cleaned up ${cleaned} connections`);
  }

  // Reset analysis
  function resetAnalysis() {
    console.log("🔄 Resetting analysis...");
    connectionHistory = [];
    console.log("✅ Analysis reset");
  }

  // Export functions
  window.webSocketAnalyzer = {
    start: startAnalysis,
    stop: stopAnalysis,
    analyze: analyzeConnections,
    details: getConnectionDetails,
    cleanup: cleanupConnections,
    reset: resetAnalysis,
    history: () => connectionHistory,
  };

  // Auto-start analysis
  startAnalysis();

  console.log("\n🛠️ Available commands:");
  console.log("- webSocketAnalyzer.start() - Start analysis");
  console.log("- webSocketAnalyzer.stop() - Stop analysis");
  console.log("- webSocketAnalyzer.analyze() - Analyze connections");
  console.log("- webSocketAnalyzer.details(id) - Get connection details");
  console.log("- webSocketAnalyzer.cleanup() - Cleanup connections");
  console.log("- webSocketAnalyzer.reset() - Reset analysis");
  console.log("- webSocketAnalyzer.history() - Get connection history");

  console.log(
    "\n💡 This tool will track all WebSocket connections and analyze patterns to identify issues."
  );
  console.log(
    "💡 Use 'webSocketAnalyzer.analyze()' to see the analysis results."
  );
})();









