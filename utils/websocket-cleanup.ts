/**
 * WebSocket Connection Cleanup Utility
 * Provides tools to manage and clean up WebSocket connections
 */

interface WebSocketConnection {
  id: string;
  ws: WebSocket;
  url: string;
  createdAt: number;
  component: string;
}

class WebSocketCleanupManager {
  private connections: Map<string, WebSocketConnection> = new Map();
  private maxConnections = 10;
  private isTrackingEnabled = false;

  constructor() {
    this.startTracking();
  }

  /**
   * Start tracking WebSocket connections
   */
  private startTracking() {
    if (this.isTrackingEnabled) return;

    this.isTrackingEnabled = true;

    // Override WebSocket constructor to track connections
    if (typeof window !== "undefined" && !(window as any)._originalWebSocket) {
      (window as any)._originalWebSocket = WebSocket;

      const self = this;
      (window as any).WebSocket = function (this: WebSocket, ...args: any[]) {
        const ws = new (window as any)._originalWebSocket(...args);

        // Generate unique ID for this connection
        const connectionId = `ws-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        // Store connection info
        const connection: WebSocketConnection = {
          id: connectionId,
          ws,
          url: args[0] || "unknown",
          createdAt: Date.now(),
          component: self.getCallerComponent() || "unknown",
        };

        self.connections.set(connectionId, connection);

        // Clean up on close
        ws.addEventListener("close", () => {
          self.connections.delete(connectionId);
        });

        console.log(
          `🔌 New WebSocket connection tracked: ${connectionId} (${connection.url})`
        );

        return ws;
      };

      // Copy static properties
      Object.setPrototypeOf(
        (window as any).WebSocket,
        (window as any)._originalWebSocket
      );
      Object.defineProperty((window as any).WebSocket, "prototype", {
        value: (window as any)._originalWebSocket.prototype,
        writable: false,
      });
    }
  }

  /**
   * Get the component that created the WebSocket (for debugging)
   */
  private getCallerComponent(): string | null {
    try {
      const stack = new Error().stack;
      if (stack) {
        const lines = stack.split("\n");
        // Look for React component names in the stack
        for (const line of lines) {
          if (
            line.includes("ChatSessionPage") ||
            line.includes("TherapistSessionsContent")
          ) {
            return line.trim();
          }
        }
      }
    } catch (e) {
      // Ignore errors
    }
    return null;
  }

  /**
   * Get all active connections
   */
  getActiveConnections(): WebSocketConnection[] {
    return Array.from(this.connections.values()).filter(
      (conn) =>
        conn.ws.readyState === WebSocket.OPEN ||
        conn.ws.readyState === WebSocket.CONNECTING
    );
  }

  /**
   * Get connection statistics
   */
  getStats() {
    const active = this.getActiveConnections();
    const total = this.connections.size;

    return {
      total,
      active: active.length,
      byComponent: active.reduce((acc, conn) => {
        acc[conn.component] = (acc[conn.component] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byUrl: active.reduce((acc, conn) => {
        acc[conn.url] = (acc[conn.url] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  /**
   * Close all connections
   */
  closeAllConnections(reason: string = "Cleanup"): number {
    console.log(
      `🧹 Closing all WebSocket connections (${this.connections.size} total)...`
    );

    let closedCount = 0;

    for (const [id, connection] of this.connections) {
      try {
        if (
          connection.ws.readyState === WebSocket.OPEN ||
          connection.ws.readyState === WebSocket.CONNECTING
        ) {
          console.log(`🔌 Closing connection ${id}: ${connection.url}`);
          connection.ws.close(1000, reason);
          closedCount++;
        }
      } catch (error) {
        console.error(`❌ Error closing connection ${id}:`, error);
      }
    }

    this.connections.clear();
    console.log(`✅ Closed ${closedCount} WebSocket connections`);

    return closedCount;
  }

  /**
   * Close connections by component
   */
  closeConnectionsByComponent(
    component: string,
    reason: string = "Component cleanup"
  ): number {
    console.log(`🧹 Closing WebSocket connections for component: ${component}`);

    let closedCount = 0;
    const toDelete: string[] = [];

    for (const [id, connection] of this.connections) {
      if (connection.component.includes(component)) {
        try {
          if (
            connection.ws.readyState === WebSocket.OPEN ||
            connection.ws.readyState === WebSocket.CONNECTING
          ) {
            console.log(`🔌 Closing connection ${id}: ${connection.url}`);
            connection.ws.close(1000, reason);
            closedCount++;
          }
        } catch (error) {
          console.error(`❌ Error closing connection ${id}:`, error);
        }
        toDelete.push(id);
      }
    }

    toDelete.forEach((id) => this.connections.delete(id));
    console.log(
      `✅ Closed ${closedCount} connections for component: ${component}`
    );

    return closedCount;
  }

  /**
   * Close connections by URL pattern
   */
  closeConnectionsByUrl(
    urlPattern: string,
    reason: string = "URL cleanup"
  ): number {
    console.log(`🧹 Closing WebSocket connections matching URL: ${urlPattern}`);

    let closedCount = 0;
    const toDelete: string[] = [];

    for (const [id, connection] of this.connections) {
      if (connection.url.includes(urlPattern)) {
        try {
          if (
            connection.ws.readyState === WebSocket.OPEN ||
            connection.ws.readyState === WebSocket.CONNECTING
          ) {
            console.log(`🔌 Closing connection ${id}: ${connection.url}`);
            connection.ws.close(1000, reason);
            closedCount++;
          }
        } catch (error) {
          console.error(`❌ Error closing connection ${id}:`, error);
        }
        toDelete.push(id);
      }
    }

    toDelete.forEach((id) => this.connections.delete(id));
    console.log(
      `✅ Closed ${closedCount} connections matching URL: ${urlPattern}`
    );

    return closedCount;
  }

  /**
   * Close oldest connections if limit exceeded
   */
  enforceConnectionLimit(): number {
    const active = this.getActiveConnections();

    if (active.length <= this.maxConnections) {
      return 0;
    }

    console.log(
      `⚠️ Connection limit exceeded (${active.length}/${this.maxConnections}). Closing oldest connections...`
    );

    // Sort by creation time and close oldest
    const sorted = active.sort((a, b) => a.createdAt - b.createdAt);
    const toClose = sorted.slice(0, active.length - this.maxConnections);

    let closedCount = 0;
    for (const connection of toClose) {
      try {
        console.log(
          `🔌 Closing old connection: ${connection.id} (${connection.url})`
        );
        connection.ws.close(1000, "Connection limit exceeded");
        this.connections.delete(connection.id);
        closedCount++;
      } catch (error) {
        console.error(
          `❌ Error closing old connection ${connection.id}:`,
          error
        );
      }
    }

    console.log(`✅ Closed ${closedCount} old connections`);
    return closedCount;
  }

  /**
   * Log current connection status
   */
  logStatus() {
    const stats = this.getStats();
    console.log("📊 WebSocket Connection Status");
    console.log("==============================");
    console.log(`Total connections: ${stats.total}`);
    console.log(`Active connections: ${stats.active}`);
    console.log("By component:", stats.byComponent);
    console.log("By URL:", stats.byUrl);

    if (stats.active > this.maxConnections) {
      console.warn(
        `⚠️ Connection limit exceeded! (${stats.active}/${this.maxConnections})`
      );
    }
  }

  /**
   * Stop tracking (restore original WebSocket)
   */
  stopTracking() {
    if (typeof window !== "undefined" && (window as any)._originalWebSocket) {
      (window as any).WebSocket = (window as any)._originalWebSocket;
      delete (window as any)._originalWebSocket;
      this.isTrackingEnabled = false;
      console.log("🔄 WebSocket tracking stopped");
    }
  }
}

// Global instance
export const wsCleanupManager = new WebSocketCleanupManager();

// Auto-cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    wsCleanupManager.closeAllConnections("Page unload");
  });

  window.addEventListener("pagehide", () => {
    wsCleanupManager.closeAllConnections("Page hide");
  });
}

// Periodic cleanup check
if (typeof window !== "undefined") {
  setInterval(() => {
    wsCleanupManager.enforceConnectionLimit();
  }, 30000); // Check every 30 seconds
}

export default WebSocketCleanupManager;



