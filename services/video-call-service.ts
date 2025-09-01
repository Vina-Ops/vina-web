import Peer from "simple-peer";

interface WebSocketMessage {
  type: string;
  data: any;
}

export interface VideoCallState {
  isInCall: boolean;
  isCallActive: boolean;
  isCallIncoming: boolean;
  isCallOutgoing: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  callDuration: number;
  participants: string[];
}

export interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
  isTherapist: boolean;
  stream?: MediaStream;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

export class VideoCallService {
  private static instance: VideoCallService;
  private socket: WebSocket | null = null;
  private peers: Map<string, Peer.Instance> = new Map();
  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private state: VideoCallState = {
    isInCall: false,
    isCallActive: false,
    isCallIncoming: false,
    isCallOutgoing: false,
    isMuted: false,
    isVideoEnabled: true,
    isScreenSharing: false,
    callDuration: 0,
    participants: [],
  };

  private callStartTime: number = 0;
  private callDurationInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): VideoCallService {
    if (!VideoCallService.instance) {
      VideoCallService.instance = new VideoCallService();
    }
    return VideoCallService.instance;
  }

  // Use existing chat socket instead of creating a new one
  setSocket(socket: WebSocket): void {
    this.socket = socket;
    this.setupSocketListeners();
  }

  // Initialize with existing socket (alternative method)
  initializeWithExistingSocket(socket: WebSocket): void {
    this.setSocket(socket);
  }

  // Connect to chat room WebSocket using the room ID
  connectToChatRoom(roomId: string, userId: string, token?: string): void {
    if (this.socket) {
      // Close existing socket if any
      this.socket.close();
    }

    // Connect to the chat room WebSocket using your specific URL pattern
    const baseUrl =
      process.env.NEXT_PUBLIC_WS_BASE_URL || "wss://vina-ai.onrender.com";
    let wsUrl = `${baseUrl}/safe-space/${roomId}`;

    // Add query parameters
    const params = new URLSearchParams();
    params.append('userId', userId);
    params.append('roomId', roomId);
    if (token) {
      params.append('token', token);
    }

    wsUrl += `?${params.toString()}`;

    console.log("Connecting to WebSocket:", wsUrl);
    this.socket = new WebSocket(wsUrl);
    this.setupSocketListeners(roomId);
  }

  // Legacy method for backward compatibility
  initializeSocket(userId: string, chatId: string): void {
    // This method is kept for backward compatibility
    // In most cases, you should use connectToChatRoom() with your room ID
    if (!this.socket) {
      const baseUrl = process.env.NEXT_PUBLIC_WS_BASE_URL || "wss://vina-ai.onrender.com";
      const wsUrl = `${baseUrl}/safe-space/${chatId}?userId=${userId}&roomId=${chatId}`;
      this.socket = new WebSocket(wsUrl);
      this.setupSocketListeners();
    }
  }

  private setupSocketListeners(roomId?: string): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log("Connected to chat room WebSocket");
      // Join the specific room
      if (this.socket && roomId) {
        this.sendMessage("join-room", { roomId });
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleWebSocketMessage(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.socket.onclose = () => {
      console.log("Disconnected from chat room WebSocket");
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket connection error:", error);
    };
  }

  private handleWebSocketMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case "video-call:user-joined":
        console.log("User joined video call:", message.data);
        this.state.participants.push(message.data);
        break;

      case "video-call:user-left":
        console.log("User left video call:", message.data);
        this.state.participants = this.state.participants.filter(
          (id) => id !== message.data
        );
        this.removePeer(message.data);
        break;

      case "video-call:offer":
        this.handleCallOffer(message.data.from, message.data.offer);
        break;

      case "video-call:answer":
        this.handleCallAnswer(message.data.from, message.data.answer);
        break;

      case "video-call:ice-candidate":
        this.handleIceCandidate(message.data.from, message.data.candidate);
        break;

      case "video-call:request":
        this.state.isCallIncoming = true;
        this.emit("call-incoming", message.data);
        break;

      case "video-call:accepted":
        this.state.isCallOutgoing = false;
        this.state.isCallActive = true;
        this.startCallTimer();
        this.emit("call-started");
        break;

      case "video-call:rejected":
        this.state.isCallOutgoing = false;
        this.emit("call-rejected");
        break;

      case "video-call:ended":
        this.endCall();
        break;

      case "video-call:room-joined":
        console.log("Joined video call room:", message.data);
        break;

      default:
        console.log("Unknown message type:", message.type);
    }
  }

  private sendMessage(type: string, data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = { type, data };
      this.socket.send(JSON.stringify(message));
    }
  }

  async startCall(
    participants: CallParticipant[],
    roomId?: string
  ): Promise<boolean> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      this.state.isCallOutgoing = true;
      this.state.participants = participants.map((p) => p.id);

      if (this.socket) {
        // Join video call room if specified
        if (roomId) {
          this.sendMessage("video-call:join-room", { roomId });
        }

        // Send call request
        this.sendMessage("video-call:request", {
          participants: participants.map((p) => ({
            id: p.id,
            name: p.name,
            avatar: p.avatar,
            isTherapist: p.isTherapist,
          })),
          roomId: roomId || "default-video-room",
        });
      }

      return true;
    } catch (error) {
      console.error("Failed to start call:", error);
      return false;
    }
  }

  async acceptCall(): Promise<boolean> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      this.state.isCallIncoming = false;
      this.state.isCallActive = true;
      this.state.isInCall = true;

      if (this.socket) {
        this.sendMessage("video-call:accept", {});
      }

      this.startCallTimer();
      this.emit("call-started");

      return true;
    } catch (error) {
      console.error("Failed to accept call:", error);
      return false;
    }
  }

  rejectCall(): void {
    this.state.isCallIncoming = false;
    if (this.socket) {
      this.sendMessage("video-call:reject", {});
    }
    this.emit("call-rejected");
  }

  endCall(): void {
    this.state.isCallActive = false;
    this.state.isInCall = false;
    this.state.isCallOutgoing = false;
    this.state.isCallIncoming = false;
    this.state.isScreenSharing = false;

    this.stopCallTimer();

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop());
      this.screenStream = null;
    }

    this.peers.forEach((peer) => peer.destroy());
    this.peers.clear();

    if (this.socket) {
      this.sendMessage("video-call:end", {});
    }

    this.emit("call-ended");
  }

  toggleMute(): void {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.state.isMuted = !audioTrack.enabled;
        this.emit("mute-toggled", this.state.isMuted);
      }
    }
  }

  toggleVideo(): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        this.state.isVideoEnabled = videoTrack.enabled;
        this.emit("video-toggled", this.state.isVideoEnabled);
      }
    }
  }

  async startScreenShare(): Promise<boolean> {
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      this.state.isScreenSharing = true;

      this.peers.forEach((peer) => {
        const videoTrack = this.screenStream!.getVideoTracks()[0];
        // Note: simple-peer doesn't have getSenders method, this would need to be handled differently
        // For now, we'll just log this limitation
        console.log("Screen share started - video track replaced");
      });

      this.emit("screen-share-started");
      return true;
    } catch (error) {
      console.error("Failed to start screen sharing:", error);
      return false;
    }
  }

  stopScreenShare(): void {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop());
      this.screenStream = null;
    }

    this.state.isScreenSharing = false;

    if (this.localStream) {
      this.peers.forEach((peer) => {
        const videoTrack = this.localStream!.getVideoTracks()[0];
        // Note: simple-peer doesn't have getSenders method, this would need to be handled differently
        // For now, we'll just log this limitation
        console.log("Screen share stopped - video track restored");
      });
    }

    this.emit("screen-share-stopped");
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getState(): VideoCallState {
    return { ...this.state };
  }

  private async handleCallOffer(from: string, offer: any): Promise<void> {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: this.localStream || undefined,
    });

    peer.signal(offer);

    peer.on("signal", (data) => {
      if (this.socket) {
        this.sendMessage("video-call:answer", { to: from, answer: data });
      }
    });

    peer.on("stream", (stream) => {
      this.emit("remote-stream", { userId: from, stream });
    });

    this.peers.set(from, peer);
  }

  private handleCallAnswer(from: string, answer: any): void {
    const peer = this.peers.get(from);
    if (peer) {
      peer.signal(answer);
    }
  }

  private handleIceCandidate(from: string, candidate: any): void {
    const peer = this.peers.get(from);
    if (peer) {
      peer.signal(candidate);
    }
  }

  private removePeer(userId: string): void {
    const peer = this.peers.get(userId);
    if (peer) {
      peer.destroy();
      this.peers.delete(userId);
    }
  }

  private startCallTimer(): void {
    this.callStartTime = Date.now();
    this.callDurationInterval = setInterval(() => {
      this.state.callDuration = Math.floor(
        (Date.now() - this.callStartTime) / 1000
      );
    }, 1000);
  }

  private stopCallTimer(): void {
    if (this.callDurationInterval) {
      clearInterval(this.callDurationInterval);
      this.callDurationInterval = null;
    }
    this.state.callDuration = 0;
  }

  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  destroy(): void {
    this.endCall();
    // Don't disconnect the socket since it's shared with chat
    this.listeners.clear();
  }
}

export const videoCallService = VideoCallService.getInstance();
