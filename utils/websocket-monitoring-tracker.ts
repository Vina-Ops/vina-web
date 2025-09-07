/**
 * Enhanced WebSocket Connection Tracker with Monitoring UI Support
 *
 * This utility provides comprehensive WebSocket connection tracking with
 * real-time monitoring, statistics, and management capabilities.
 */

interface ConnectionInfo {
  id: string;
  type: string;
  websocket: WebSocket;
  url: string;
  createdAt: Date;
  lastActivity: Date;
  status: "connecting" | "connected" | "disconnected" | "error";
  metadata?: Record<string, any>;
}

interface ConnectionStats {
  total: number;
  active: number;
  limit: number;
  available: number;
  connections: ConnectionInfo[];
}

class WebSocketMonitoringTracker {
  private connections = new Map<string, ConnectionInfo>();
  private readonly MAX_CONNECTIONS = 30;
  private eventListeners = new Set<(stats: ConnectionStats) => void>();

  // Add connection tracking
  trackConnection(
    id: string,
    type: string,
    websocket: WebSocket,
    url: string,
    metadata?: Record<string, any>
  ): boolean {
    // Check if at limit
    if (this.getActiveCount() >= this.MAX_CONNECTIONS) {
      console.warn(
        `Connection limit reached (${this.MAX_CONNECTIONS}). Cannot create new connection.`
      );
      return false;
    }

    const connectionInfo: ConnectionInfo = {
      id,
      type,
      websocket,
      url,
      createdAt: new Date(),
      lastActivity: new Date(),
      status: "connecting",
      metadata,
    };

    this.connections.set(id, connectionInfo);

    // Track WebSocket events
    websocket.addEventListener("open", () => {
      connectionInfo.status = "connected";
      connectionInfo.lastActivity = new Date();
      this.notifyListeners();
      console.log(`WebSocket connected: ${id}`);
    });

    websocket.addEventListener("message", () => {
      connectionInfo.lastActivity = new Date();
    });

    websocket.addEventListener("close", (event) => {
      connectionInfo.status = "disconnected";
      connectionInfo.lastActivity = new Date();
      this.notifyListeners();
      console.log(`WebSocket disconnected: ${id}`, event.code, event.reason);
    });

    websocket.addEventListener("error", (error) => {
      connectionInfo.status = "error";
      connectionInfo.lastActivity = new Date();
      this.notifyListeners();
      console.error(`WebSocket error: ${id}`, error);
    });

    this.notifyListeners();
    console.log(`Tracking connection: ${id} (${type})`);
    return true;
  }

  // Remove connection
  removeConnection(id: string): boolean {
    const connection = this.connections.get(id);
    if (connection) {
      // Close the WebSocket if still open
      if (connection.websocket.readyState === WebSocket.OPEN) {
        connection.websocket.close(1000, "Connection removed by tracker");
      }
      this.connections.delete(id);
      this.notifyListeners();
      console.log(`Removed connection: ${id}`);
      return true;
    }
    return false;
  }

  // Force close connection
  closeConnection(id: string): boolean {
    const connection = this.connections.get(id);
    if (connection && connection.websocket.readyState === WebSocket.OPEN) {
      connection.websocket.close(1000, "Manually closed");
      return true;
    }
    return false;
  }

  // Close oldest connections
  closeOldestConnections(count: number): string[] {
    const activeConnections = Array.from(this.connections.values())
      .filter((c) => c.status === "connected")
      .sort((a, b) => a.lastActivity.getTime() - b.lastActivity.getTime())
      .slice(0, count);

    const closedIds: string[] = [];
    activeConnections.forEach((connection) => {
      if (connection.websocket.readyState === WebSocket.OPEN) {
        connection.websocket.close(1000, "Closed to free up slots");
        closedIds.push(connection.id);
      }
    });

    return closedIds;
  }

  // Get current stats
  getStats(): ConnectionStats {
    const connections = Array.from(this.connections.values());
    const active = connections.filter((c) => c.status === "connected").length;

    return {
      total: connections.length,
      active,
      limit: this.MAX_CONNECTIONS,
      available: this.MAX_CONNECTIONS - active,
      connections: connections.sort(
        (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
      ),
    };
  }

  // Get active connection count
  getActiveCount(): number {
    return Array.from(this.connections.values()).filter(
      (c) => c.status === "connected"
    ).length;
  }

  // Check if can create new connection
  canCreateConnection(): boolean {
    return this.getActiveCount() < this.MAX_CONNECTIONS;
  }

  // Subscribe to stats changes
  onStatsChange(listener: (stats: ConnectionStats) => void): () => void {
    this.eventListeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  // Cleanup old disconnected connections
  cleanup(): number {
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const toRemove: string[] = [];

    this.connections.forEach((connection, id) => {
      if (
        connection.status === "disconnected" &&
        connection.lastActivity.getTime() < tenMinutesAgo
      ) {
        toRemove.push(id);
      }
    });

    toRemove.forEach((id) => this.connections.delete(id));

    if (toRemove.length > 0) {
      this.notifyListeners();
      console.log(
        `🧹 Cleaned up ${toRemove.length} old disconnected connections`
      );
    }

    return toRemove.length;
  }

  private notifyListeners(): void {
    const stats = this.getStats();
    this.eventListeners.forEach((listener) => {
      try {
        listener(stats);
      } catch (error) {
        console.error("Error in stats listener:", error);
      }
    });
  }

  // Get connection by ID
  getConnection(id: string): ConnectionInfo | undefined {
    return this.connections.get(id);
  }

  // Get connections by type
  getConnectionsByType(type: string): ConnectionInfo[] {
    return Array.from(this.connections.values()).filter((c) => c.type === type);
  }
}

// Export singleton instance
export const wsMonitoringTracker = new WebSocketMonitoringTracker();

// Auto cleanup every 10 minutes
setInterval(() => {
  wsMonitoringTracker.cleanup();
}, 10 * 60 * 1000);

export default WebSocketMonitoringTracker;
