/**
 * WebSocket Connection Tracker
 *
 * This utility helps track and manage WebSocket connections to prevent
 * connection maxing out issues when navigating between pages.
 */

interface TrackedConnection {
  id: string;
  type: "therapist-chat" | "user-chat" | "ai-chat" | "peerjs";
  ws: WebSocket;
  page: string;
  createdAt: number;
}

class WebSocketConnectionTracker {
  private connections: Map<string, TrackedConnection> = new Map();
  private maxConnections = 10; // Maximum allowed connections
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startPeriodicCleanup();
  }

  /**
   * Track a new WebSocket connection
   */
  trackConnection(
    id: string,
    type: TrackedConnection["type"],
    ws: WebSocket,
    page: string
  ): void {
    // Remove any existing connection with the same ID
    this.untrackConnection(id);

    // Check if we're at the connection limit
    if (this.connections.size >= this.maxConnections) {
      console.warn(
        `⚠️ WebSocket connection limit reached (${this.maxConnections}). Cleaning up oldest connections.`
      );
      this.cleanupOldestConnections();
    }

    const connection: TrackedConnection = {
      id,
      type,
      ws,
      page,
      createdAt: Date.now(),
    };

    this.connections.set(id, connection);
    console.log(`📡 Tracking WebSocket connection: ${id} (${type}) on ${page}`);
    console.log(`📊 Total connections: ${this.connections.size}`);

    // Set up cleanup when WebSocket closes
    ws.addEventListener("close", () => {
      this.untrackConnection(id);
    });

    ws.addEventListener("error", () => {
      this.untrackConnection(id);
    });
  }

  /**
   * Stop tracking a WebSocket connection
   */
  untrackConnection(id: string): void {
    const connection = this.connections.get(id);
    if (connection) {
      this.connections.delete(id);
      console.log(`🧹 Untracking WebSocket connection: ${id}`);
      console.log(`📊 Total connections: ${this.connections.size}`);
    }
  }

  /**
   * Close and untrack a specific connection
   */
  closeConnection(
    id: string,
    code: number = 1000,
    reason: string = "Manual close"
  ): void {
    const connection = this.connections.get(id);
    if (connection && connection.ws.readyState === WebSocket.OPEN) {
      console.log(`🔌 Closing tracked WebSocket connection: ${id}`);
      connection.ws.close(code, reason);
    }
    this.untrackConnection(id);
  }

  /**
   * Close all connections of a specific type
   */
  closeConnectionsByType(type: TrackedConnection["type"]): void {
    const connectionsToClose: string[] = [];

    this.connections.forEach((connection, id) => {
      if (connection.type === type) {
        connectionsToClose.push(id);
      }
    });

    connectionsToClose.forEach((id) => {
      this.closeConnection(id, 1000, `Closing all ${type} connections`);
    });

    if (connectionsToClose.length > 0) {
      console.log(`🔌 Closed ${connectionsToClose.length} ${type} connections`);
    }
  }

  /**
   * Close all connections for a specific page
   */
  closeConnectionsByPage(page: string): void {
    const connectionsToClose: string[] = [];

    this.connections.forEach((connection, id) => {
      if (connection.page === page) {
        connectionsToClose.push(id);
      }
    });

    connectionsToClose.forEach((id) => {
      this.closeConnection(id, 1000, `Closing connections for ${page}`);
    });

    if (connectionsToClose.length > 0) {
      console.log(
        `🔌 Closed ${connectionsToClose.length} connections for page: ${page}`
      );
    }
  }

  /**
   * Close all tracked connections
   */
  closeAllConnections(reason: string = "Global cleanup"): void {
    const connectionIds = Array.from(this.connections.keys());

    connectionIds.forEach((id) => {
      this.closeConnection(id, 1000, reason);
    });

    if (connectionIds.length > 0) {
      console.log(`🔌 Closed all ${connectionIds.length} tracked connections`);
    }
  }

  /**
   * Get connection statistics
   */
  getStats(): {
    total: number;
    byType: Record<string, number>;
    byPage: Record<string, number>;
    oldest: TrackedConnection | null;
  } {
    const byType: Record<string, number> = {};
    const byPage: Record<string, number> = {};
    let oldest: TrackedConnection | null = null;

    this.connections.forEach((connection) => {
      byType[connection.type] = (byType[connection.type] || 0) + 1;
      byPage[connection.page] = (byPage[connection.page] || 0) + 1;

      if (!oldest || connection.createdAt < oldest.createdAt) {
        oldest = connection;
      }
    });

    return {
      total: this.connections.size,
      byType,
      byPage,
      oldest,
    };
  }

  /**
   * Clean up oldest connections when limit is reached
   */
  private cleanupOldestConnections(): void {
    const connections = Array.from(this.connections.values());
    connections.sort((a, b) => a.createdAt - b.createdAt);

    // Close the oldest 25% of connections
    const toClose = Math.ceil(connections.length * 0.25);
    for (let i = 0; i < toClose; i++) {
      const connection = connections[i];
      this.closeConnection(connection.id, 1000, "Connection limit cleanup");
    }
  }

  /**
   * Start periodic cleanup of stale connections
   */
  private startPeriodicCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const staleThreshold = 5 * 60 * 1000; // 5 minutes
      const staleConnections: string[] = [];

      this.connections.forEach((connection, id) => {
        if (
          connection.ws.readyState === WebSocket.CLOSED ||
          connection.ws.readyState === WebSocket.CLOSING ||
          now - connection.createdAt > staleThreshold
        ) {
          staleConnections.push(id);
        }
      });

      staleConnections.forEach((id) => {
        this.untrackConnection(id);
      });

      if (staleConnections.length > 0) {
        console.log(
          `🧹 Cleaned up ${staleConnections.length} stale connections`
        );
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Stop the periodic cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.closeAllConnections("Tracker destroyed");
  }
}

// Global instance
export const wsConnectionTracker = new WebSocketConnectionTracker();

// Auto-cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    wsConnectionTracker.closeAllConnections("Page unload");
  });

  window.addEventListener("pagehide", () => {
    wsConnectionTracker.closeAllConnections("Page hide");
  });
}

export default WebSocketConnectionTracker;
