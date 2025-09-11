import { Message } from "@/types/chat";
import {
  getWebSocketUrl,
  WEBSOCKET_CONFIG,
  isWebSocketSupported,
} from "@/lib/websocket-config";

export interface ChatWebSocketMessage {
  type: "message" | "typing" | "error" | "connection" | "auth";
  data: any;
}

export interface HumanMessage {
  human: string;
}

export interface VinaResponse {
  vina: string;
}

export class ChatWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = WEBSOCKET_CONFIG.maxReconnectAttempts;
  private reconnectDelay = WEBSOCKET_CONFIG.reconnectDelay;
  private isConnecting = false;
  private messageQueue: string[] = [];

  // Event handlers
  private onMessageHandler: ((message: Message) => void) | null = null;
  private onTypingHandler: ((isTyping: boolean) => void) | null = null;
  private onConnectionChangeHandler: ((connected: boolean) => void) | null =
    null;
  private onErrorHandler: ((error: string) => void) | null = null;

  constructor() {
    // Only connect on the client side
    if (typeof window !== "undefined" && isWebSocketSupported()) {
      this.connect().catch((error) => {
        console.error("Failed to connect WebSocket:", error);
        this.onErrorHandler?.("Failed to establish WebSocket connection");
      });
    } else if (typeof window !== "undefined") {
      console.error("WebSocket is not supported in this environment");
      this.onErrorHandler?.("WebSocket is not supported");
    }
  }

  private getWebSocketUrl(): string {
    return getWebSocketUrl("api/vina");
  }

  private getWebSocketUrlWithAuth(token: string): string {
    const baseUrl = getWebSocketUrl("api/vina");
    // Try different formats for the authorization header
    const authParam = `token=${encodeURIComponent(token)}`;
    // console.log("Auth parameter:", authParam);
    return `${baseUrl}?${authParam}`;
  }

  private getWebSocketUrlWithTokenParam(token: string): string {
    const baseUrl = getWebSocketUrl("api/vina");
    const authParam = `token=${encodeURIComponent(token)}`;
    // console.log("Token parameter:", authParam);
    return `${baseUrl}?${authParam}`;
  }

  private async connect(): Promise<void> {
    // console.log(
    //   "Connect method called - isConnecting:",
    //   this.isConnecting,
    //   "readyState:",
    //   this.ws?.readyState
    // );
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      // console.log("Skipping connection - already connecting or connected");
      return;
    }

    this.isConnecting = true;

    try {
      // Get the WebSocket token for authentication
      const { fetchWsToken } = await import("@/helpers/get-ws-token");
      const token = await fetchWsToken();

      // console.log("WebSocket auth - token available:", !!token);

      // Create WebSocket connection with Authorization in query parameter
      if (token) {
        // Try different authentication approaches
        const wsUrl = this.getWebSocketUrlWithAuth(token);
        // console.log(
        //   "🔗 Connecting to WebSocket with Authorization in query param:",
        //   wsUrl
        // );
        // console.log("Token being used:", token.substring(0, 20) + "...");

        this.ws = new WebSocket(wsUrl);
      } else {
        const wsUrl = this.getWebSocketUrl();
        // console.log(
        //   "🔗 No auth token available, connecting without authentication:",
        //   wsUrl
        // );
        this.ws = new WebSocket(wsUrl);
      }

      // Add connection state logging
      // console.log("🔍 WebSocket object created:", this.ws);
      // console.log("🔍 WebSocket URL:", this.ws.url);
      // console.log("🔍 WebSocket readyState:", this.ws.readyState);

      this.ws.onopen = () => {
        // console.log("🎉 WebSocket connected successfully!");
        // console.log("WebSocket readyState:", this.ws?.readyState);
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Authentication is handled via query parameter, no need for post-connection auth

        // Notify that connection is established
        // console.log(
        //   "WebSocket onopen: onConnectionChangeHandler exists:",
        //   !!this.onConnectionChangeHandler
        // );
        if (this.onConnectionChangeHandler) {
          // console.log("✅ Calling onConnectionChangeHandler with true");
          this.onConnectionChangeHandler(true);
        } else {
          console.warn("❌ No connection change handler registered");
        }

        // Send any queued messages
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          if (message) {
            this.sendMessage(message);
          }
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: ChatWebSocketMessage = JSON.parse(event.data);
          this.handleIncomingMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = (event) => {
        // console.log("🔌 WebSocket disconnected:", event.code, event.reason);
        // console.log("Close event details:", event);
        this.isConnecting = false;
        this.onConnectionChangeHandler?.(false);

        // Attempt to reconnect if not a normal closure
        if (
          event.code !== 1000 &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        console.error("Error details:", error);
        this.isConnecting = false;
        this.onErrorHandler?.("WebSocket connection error");
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      this.isConnecting = false;
      this.onErrorHandler?.("Failed to create WebSocket connection");
    }
  }

  private messageIdCounter = 0;

  private generateUniqueId(): string {
    this.messageIdCounter++;
    return `${Date.now()}-${this.messageIdCounter}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  private handleIncomingMessage(data: any): void {
    // console.log("WebSocket received data:", data);
    try {
      // Handle Vina response format: { "vina": "response content" } - Priority for AI chat
      if (data.vina && typeof data.vina === "string") {
        if (this.onMessageHandler) {
          // console.log("📨 Vina response received:", data.vina);
          // console.log("📅 Timestamp from server:", data.timestamp);

          // Clean up the response content
          let cleanedContent = data.vina;

          // Remove "Vina:" prefix if present (handle various formats)
          cleanedContent = cleanedContent.replace(
            /^(\*\*)?Vina:(\*\*)?\s*/gi,
            ""
          );

          // Remove asterisks for bold/italic formatting
          cleanedContent = cleanedContent.replace(/\*\*/g, ""); // Remove bold
          cleanedContent = cleanedContent.replace(/\*/g, ""); // Remove italic

          // Clean up any extra whitespace
          cleanedContent = cleanedContent.trim();

          // Debug: Log the cleaned response
          // console.log("Cleaned Vina response:", cleanedContent);

          // Parse timestamp from the message
          const timestamp = data.timestamp
            ? new Date(data.timestamp).toISOString()
            : new Date().toISOString();
          // console.log("🕐 Parsed timestamp:", timestamp);

          const message: Message = {
            id: this.generateUniqueId(),
            content: cleanedContent,
            sender: "ai",
            timestamp: timestamp,
            type: "text",
            isRead: false,
          };
          this.onMessageHandler(message);
        }
        return;
      }

      // Handle new unified format: { "content": "message", "sender": "uuid", "timestamp": "time" }
      // This is mainly for therapist-patient chat, lower priority for AI chat
      if (
        data.content &&
        typeof data.content === "string" &&
        data.sender &&
        data.timestamp
      ) {
        if (this.onMessageHandler) {
          // console.log("📨 Unified format message received:", data);

          const message: Message = {
            id: this.generateUniqueId(),
            content: data.content,
            sender: "ai", // Treat as AI response in the main chat
            timestamp: new Date(data.timestamp).toISOString(),
            type: "text",
            isRead: false,
          };
          this.onMessageHandler(message);
        }
        return;
      }

      // Handle human message format: { "human": "message content" }
      if (data.human && typeof data.human === "string") {
        if (this.onMessageHandler) {
          // console.log("👤 Human message received:", data.human);
          // console.log("📅 Human timestamp from server:", data.timestamp);

          // Parse timestamp from the message
          const timestamp = data.timestamp
            ? new Date(data.timestamp).toISOString()
            : new Date().toISOString();
          // console.log("🕐 Parsed human timestamp:", timestamp);

          const message: Message = {
            id: this.generateUniqueId(),
            content: data.human,
            sender: "user",
            timestamp: timestamp,
            type: "text",
            isRead: false,
          };
          this.onMessageHandler(message);
        }
        return;
      }

      // Handle legacy message format with type field
      if (data.type) {
        switch (data.type) {
          case "message":
            if (this.onMessageHandler) {
              const message: Message = {
                id: this.generateUniqueId(),
                content: data.data.content,
                sender: "ai",
                timestamp: new Date().toISOString(),
                type: "text",
                isRead: false,
              };
              this.onMessageHandler(message);
            }
            break;

          case "typing":
            if (this.onTypingHandler) {
              this.onTypingHandler(data.data.isTyping);
            }
            break;

          case "error":
            if (this.onErrorHandler) {
              this.onErrorHandler(data.data.message || "Unknown error");
            }
            break;

          case "connection":
            // console.log("Connection status:", data.data);
            break;

          case "auth":
            // console.log("Authentication response:", data.data);
            break;

          default:
            console.warn("Unknown message type:", data.type);
        }
      } else {
        console.warn("Unknown message format:", data);
      }
    } catch (error) {
      console.error("Error handling incoming message:", error);
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`
    );

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error("Reconnect failed:", error);
      });
    }, delay);
  }

  public sendMessage(content: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      // Queue the message if not connected
      this.messageQueue.push(content);
      return;
    }

    try {
      // Use AI chat format: { "human": "message content" }
      const message = {
        human: content,
      };

      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error("Error sending message:", error);
      this.onErrorHandler?.("Failed to send message");
    }
  }

  public onMessage(handler: (message: Message) => void): void {
    this.onMessageHandler = handler;
  }

  public onTyping(handler: (isTyping: boolean) => void): void {
    this.onTypingHandler = handler;
  }

  public onConnectionChange(handler: (connected: boolean) => void): void {
    this.onConnectionChangeHandler = handler;
  }

  public onError(handler: (error: string) => void): void {
    this.onErrorHandler = handler;
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, "User disconnected");
      this.ws = null;
    }
    this.messageQueue = [];
    this.reconnectAttempts = 0;
  }

  public cleanup(): void {
    this.disconnect();
    this.onMessageHandler = null;
    this.onTypingHandler = null;
    this.onConnectionChangeHandler = null;
    this.onErrorHandler = null;
  }

  public isConnected(): boolean {
    const connected = this.ws?.readyState === WebSocket.OPEN;
    // console.log(
    //   "Service: isConnected() called, readyState:",
    //   this.ws?.readyState,
    //   "connected:",
    //   connected
    // );
    return connected;
  }

  public forceReconnect(): void {
    console.log("Force reconnecting WebSocket");
    this.disconnect();
    this.connect().catch((error) => {
      console.error("Force reconnect failed:", error);
    });
  }

  public testDifferentAuthMethods(): void {
    console.log("🧪 Testing different authentication methods...");
    // This method can be used to test different auth approaches
    // For now, just log the current approach
    console.log("Current approach: Using token as query parameter");
  }

  public debugConnection(): void {
    console.log("🔍 Debugging WebSocket connection...");
    console.log("WebSocket instance:", this.ws);
    console.log("WebSocket readyState:", this.ws?.readyState);
    console.log("isConnecting:", this.isConnecting);
    console.log("reconnectAttempts:", this.reconnectAttempts);
    console.log(
      "onConnectionChangeHandler exists:",
      !!this.onConnectionChangeHandler
    );
  }

  public testSimpleConnection(): void {
    console.log("🧪 Testing simple connection without auth...");
    const baseUrl = this.getWebSocketUrl();
    console.log("Testing connection to:", baseUrl);

    const testWs = new WebSocket(baseUrl);

    testWs.onopen = () => {
      console.log("✅ Simple connection successful!");
      testWs.close();
    };

    testWs.onerror = (error) => {
      console.error("❌ Simple connection failed:", error);
    };

    testWs.onclose = (event) => {
      console.log("🔌 Simple connection closed:", event.code, event.reason);
    };
  }

  public tryTokenParamAuth(): void {
    console.log("Trying token parameter authentication...");
    if (this.ws) {
      this.ws.close();
    }
    this.connectWithTokenParam().catch((error) => {
      console.error("Token param auth failed:", error);
    });
  }

  private async connectWithTokenParam(): Promise<void> {
    const { fetchToken } = await import("@/helpers/get-token");
    const token = await fetchToken();

    if (token) {
      const wsUrl = this.getWebSocketUrlWithTokenParam(token);
      console.log("Connecting with token parameter:", wsUrl);
      this.ws = new WebSocket(wsUrl);
      this.setupWebSocketHandlers();
    }
  }

  private setupWebSocketHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log("WebSocket connected (token param method)");
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.onConnectionChangeHandler?.(true);
    };

    this.ws.onmessage = (event) => {
      try {
        const data: ChatWebSocketMessage = JSON.parse(event.data);
        this.handleIncomingMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.ws.onclose = (event) => {
      console.log(
        "WebSocket disconnected (token param method):",
        event.code,
        event.reason
      );
      this.isConnecting = false;
      this.onConnectionChangeHandler?.(false);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error (token param method):", error);
      this.isConnecting = false;
      this.onErrorHandler?.("WebSocket connection error");
    };
  }
}

// Lazy singleton instance
let _chatWebSocketService: ChatWebSocketService | null = null;

export const getChatWebSocketService = (): ChatWebSocketService => {
  // Only create the service on the client side
  if (typeof window === "undefined") {
    throw new Error("WebSocket service can only be used on the client side");
  }

  console.log(
    "getChatWebSocketService called - existing service:",
    !!_chatWebSocketService
  );
  if (!_chatWebSocketService) {
    console.log("Creating new WebSocket service");
    _chatWebSocketService = new ChatWebSocketService();
  } else {
    console.log("Reusing existing WebSocket service");
  }
  return _chatWebSocketService;
};

export const cleanupChatWebSocketService = (): void => {
  if (_chatWebSocketService) {
    _chatWebSocketService.cleanup();
    _chatWebSocketService = null;
  }
};

export const resetChatWebSocketService = (): void => {
  console.log("Resetting WebSocket service singleton");
  cleanupChatWebSocketService();
};

// For backward compatibility, but prefer using getChatWebSocketService()
// Note: Use getChatWebSocketService() instead of this export to avoid immediate instantiation
export const chatWebSocketService = {
  onMessage: (handler: (message: any) => void) =>
    getChatWebSocketService().onMessage(handler),
  onTyping: (handler: (isTyping: boolean) => void) =>
    getChatWebSocketService().onTyping(handler),
  onConnectionChange: (handler: (connected: boolean) => void) =>
    getChatWebSocketService().onConnectionChange(handler),
  onError: (handler: (error: string) => void) =>
    getChatWebSocketService().onError(handler),
  sendMessage: (content: string) =>
    getChatWebSocketService().sendMessage(content),
  disconnect: () => getChatWebSocketService().disconnect(),
  isConnected: () => getChatWebSocketService().isConnected(),
};
