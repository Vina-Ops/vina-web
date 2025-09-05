/**
 * WebSocket Connection Manager
 * Manages WebSocket connections to prevent connection pool exhaustion
 */

interface WebSocketConnection {
  id: string;
  ws: WebSocket;
  url: string;
  createdAt: number;
  lastActivity: number;
  isActive: boolean;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectInterval: number;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onReconnect?: () => void;
}

class WebSocketManager {
  private connections: Map<string, WebSocketConnection> = new Map();
  private maxConnections = 10; // Maximum number of concurrent connections
  private connectionTimeout = 30000; // 30 seconds timeout for inactive connections
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupInterval();
  }

  /**
   * Create or get an existing WebSocket connection
   */
  createConnection(
    id: string,
    url: string,
    onMessage?: (event: MessageEvent) => void,
    onClose?: () => void,
    onError?: (error: Event) => void,
    onReconnect?: () => void,
    maxReconnectAttempts: number = 5,
    reconnectInterval: number = 3000
  ): WebSocket | null {
    // Check if connection already exists and is active
    const existingConnection = this.connections.get(id);
    if (
      existingConnection &&
      existingConnection.isActive &&
      existingConnection.ws.readyState === WebSocket.OPEN
    ) {
      console.log(`🔄 Reusing existing WebSocket connection: ${id}`);
      existingConnection.lastActivity = Date.now();
      return existingConnection.ws;
    }

    // Check connection limit
    if (this.connections.size >= this.maxConnections) {
      console.warn(
        `⚠️ Maximum WebSocket connections reached (${this.maxConnections}). Closing oldest connection.`
      );
      this.closeOldestConnection();
    }

    try {
      console.log(`🔌 Creating new WebSocket connection: ${id}`);
      const ws = new WebSocket(url);

      const connection: WebSocketConnection = {
        id,
        ws,
        url,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        isActive: true,
        reconnectAttempts: 0,
        maxReconnectAttempts,
        reconnectInterval,
        onClose,
        onError,
        onReconnect,
      };

      // Set up event handlers
      ws.onopen = () => {
        console.log(`✅ WebSocket connected: ${id}`);
        connection.lastActivity = Date.now();
      };

      ws.onmessage = (event) => {
        connection.lastActivity = Date.now();
        if (onMessage) {
          onMessage(event);
        }
      };

      ws.onclose = (event) => {
        console.log(`🔌 WebSocket closed: ${id} (code: ${event.code})`);
        connection.isActive = false;

        // Attempt reconnection if not a normal closure and we haven't exceeded max attempts
        if (
          event.code !== 1000 &&
          connection.reconnectAttempts < connection.maxReconnectAttempts
        ) {
          console.log(
            `🔄 Attempting to reconnect WebSocket: ${id} (attempt ${
              connection.reconnectAttempts + 1
            }/${connection.maxReconnectAttempts})`
          );
          connection.reconnectAttempts++;

          setTimeout(() => {
            this.reconnectConnection(id);
          }, connection.reconnectInterval);
        } else {
          // Remove connection if max attempts reached or normal closure
          this.connections.delete(id);
          if (onClose) {
            onClose();
          }
        }
      };

      ws.onerror = (error) => {
        console.error(`❌ WebSocket error: ${id}`, error);
        connection.isActive = false;
        if (onError) {
          onError(error);
        }
      };

      this.connections.set(id, connection);
      return ws;
    } catch (error) {
      console.error(`❌ Failed to create WebSocket connection: ${id}`, error);
      return null;
    }
  }

  /**
   * Reconnect a WebSocket connection
   */
  private reconnectConnection(id: string): void {
    const connection = this.connections.get(id);
    if (!connection) return;

    try {
      console.log(`🔄 Reconnecting WebSocket: ${id}`);
      const newWs = new WebSocket(connection.url);

      // Update the connection with new WebSocket
      connection.ws = newWs;
      connection.isActive = true;
      connection.lastActivity = Date.now();

      // Set up event handlers for the new connection
      newWs.onopen = () => {
        console.log(`✅ WebSocket reconnected: ${id}`);
        connection.lastActivity = Date.now();
        connection.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        if (connection.onReconnect) {
          connection.onReconnect();
        }
      };

      newWs.onmessage = (event) => {
        connection.lastActivity = Date.now();
        // Note: onMessage handler is not stored in connection, so we can't restore it
        // This is a limitation of the current design
      };

      newWs.onclose = (event) => {
        console.log(
          `🔌 Reconnected WebSocket closed: ${id} (code: ${event.code})`
        );
        connection.isActive = false;

        if (
          event.code !== 1000 &&
          connection.reconnectAttempts < connection.maxReconnectAttempts
        ) {
          console.log(
            `🔄 Attempting to reconnect again: ${id} (attempt ${
              connection.reconnectAttempts + 1
            }/${connection.maxReconnectAttempts})`
          );
          connection.reconnectAttempts++;

          setTimeout(() => {
            this.reconnectConnection(id);
          }, connection.reconnectInterval);
        } else {
          this.connections.delete(id);
          if (connection.onClose) {
            connection.onClose();
          }
        }
      };

      newWs.onerror = (error) => {
        console.error(`❌ Reconnected WebSocket error: ${id}`, error);
        connection.isActive = false;
        if (connection.onError) {
          connection.onError(error);
        }
      };
    } catch (error) {
      console.error(`❌ Failed to reconnect WebSocket: ${id}`, error);
      connection.isActive = false;
      this.connections.delete(id);
      if (connection.onClose) {
        connection.onClose();
      }
    }
  }

  /**
   * Close a specific WebSocket connection
   */
  closeConnection(
    id: string,
    code: number = 1000,
    reason: string = "Normal closure"
  ): void {
    const connection = this.connections.get(id);
    if (connection && connection.isActive) {
      console.log(`🔌 Closing WebSocket connection: ${id}`);
      connection.isActive = false;
      connection.ws.close(code, reason);
      this.connections.delete(id);
    }
  }

  /**
   * Close all WebSocket connections
   */
  closeAllConnections(reason: string = "Application shutdown"): void {
    console.log(
      `🔌 Closing all WebSocket connections (${this.connections.size} total)`
    );

    for (const [id, connection] of this.connections) {
      if (connection.isActive) {
        connection.isActive = false;
        connection.ws.close(1000, reason);
      }
    }

    this.connections.clear();
  }

  /**
   * Close the oldest connection to make room for new ones
   */
  private closeOldestConnection(): void {
    let oldestId = "";
    let oldestTime = Date.now();

    for (const [id, connection] of this.connections) {
      if (connection.createdAt < oldestTime) {
        oldestTime = connection.createdAt;
        oldestId = id;
      }
    }

    if (oldestId) {
      console.log(`🔌 Closing oldest WebSocket connection: ${oldestId}`);
      this.closeConnection(oldestId, 1000, "Connection limit reached");
    }
  }

  /**
   * Start cleanup interval to remove inactive connections
   */
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const inactiveConnections: string[] = [];

      for (const [id, connection] of this.connections) {
        // Close connections that have been inactive for too long
        if (now - connection.lastActivity > this.connectionTimeout) {
          inactiveConnections.push(id);
        }
      }

      // Close inactive connections
      for (const id of inactiveConnections) {
        console.log(`🧹 Closing inactive WebSocket connection: ${id}`);
        this.closeConnection(id, 1000, "Connection timeout");
      }
    }, 10000); // Check every 10 seconds
  }

  /**
   * Get connection statistics
   */
  getStats(): {
    total: number;
    active: number;
    inactive: number;
    reconnecting: number;
    maxConnections: number;
  } {
    let active = 0;
    let inactive = 0;
    let reconnecting = 0;

    for (const connection of this.connections.values()) {
      if (connection.isActive && connection.ws.readyState === WebSocket.OPEN) {
        active++;
      } else if (connection.isActive && connection.reconnectAttempts > 0) {
        reconnecting++;
      } else {
        inactive++;
      }
    }

    return {
      total: this.connections.size,
      active,
      inactive,
      reconnecting,
      maxConnections: this.maxConnections,
    };
  }

  /**
   * Check if a specific connection is active
   */
  isConnectionActive(id: string): boolean {
    const connection = this.connections.get(id);
    return connection
      ? connection.isActive && connection.ws.readyState === WebSocket.OPEN
      : false;
  }

  /**
   * Get connection status for a specific connection
   */
  getConnectionStatus(id: string): {
    isActive: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
    readyState: number;
  } | null {
    const connection = this.connections.get(id);
    if (!connection) return null;

    return {
      isActive:
        connection.isActive && connection.ws.readyState === WebSocket.OPEN,
      reconnectAttempts: connection.reconnectAttempts,
      maxReconnectAttempts: connection.maxReconnectAttempts,
      readyState: connection.ws.readyState,
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.closeAllConnections("Manager destroyed");
  }
}

// Global WebSocket manager instance
export const wsManager = new WebSocketManager();

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    wsManager.closeAllConnections("Page unloading");
  });

  // Also cleanup on page hide (mobile browsers)
  window.addEventListener("pagehide", () => {
    wsManager.closeAllConnections("Page hidden");
  });
}

export default WebSocketManager;
