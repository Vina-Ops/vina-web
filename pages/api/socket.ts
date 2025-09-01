import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketServer extends NetServer {
  io?: SocketIOServer;
}

interface SocketWithIO {
  socket: {
    server: SocketServer;
  };
}

const SocketHandler = (
  req: NextApiRequest,
  res: NextApiResponse & SocketWithIO
) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  console.log("Setting up socket");
  const io = new SocketIOServer(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // === CHAT EVENTS ===
    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);
      console.log(`User ${socket.id} joined chat room ${roomId}`);
    });

    socket.on("send-message", (data) => {
      socket.to(data.roomId).emit("new-message", {
        ...data,
        from: socket.id,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("typing", (data) => {
      socket.to(data.roomId).emit("user-typing", {
        userId: socket.id,
        isTyping: data.isTyping,
      });
    });

    // === VIDEO CALL EVENTS ===
    socket.on("video-call:join-room", (roomId: string) => {
      socket.join(`video-${roomId}`);
      socket.to(`video-${roomId}`).emit("video-call:user-joined", socket.id);
      socket.emit("video-call:room-joined", roomId);
      console.log(`User ${socket.id} joined video call room ${roomId}`);
    });

    socket.on("video-call:request", (data) => {
      const { participants, roomId } = data;
      participants.forEach((participant: any) => {
        socket.to(participant.id).emit("video-call:request", {
          from: socket.id,
          participant: data,
          roomId,
        });
      });
    });

    socket.on("video-call:accept", () => {
      socket.broadcast.emit("video-call:accepted", { from: socket.id });
    });

    socket.on("video-call:reject", () => {
      socket.broadcast.emit("video-call:rejected", { from: socket.id });
    });

    socket.on("video-call:end", () => {
      socket.broadcast.emit("video-call:ended", { from: socket.id });
    });

    // WebRTC signaling for video calls
    socket.on("video-call:offer", (data) => {
      socket.to(data.to).emit("video-call:offer", {
        from: socket.id,
        offer: data.offer,
      });
    });

    socket.on("video-call:answer", (data) => {
      socket.to(data.to).emit("video-call:answer", {
        from: socket.id,
        answer: data.answer,
      });
    });

    socket.on("video-call:ice-candidate", (data) => {
      socket.to(data.to).emit("video-call:ice-candidate", {
        from: socket.id,
        candidate: data.candidate,
      });
    });

    // === LEGACY EVENTS (for backward compatibility) ===
    socket.on("call-request", (data) => {
      const { participants } = data;
      participants.forEach((participant: any) => {
        socket.to(participant.id).emit("call-request", {
          from: socket.id,
          participant: data,
        });
      });
    });

    socket.on("call-accepted", () => {
      socket.broadcast.emit("call-accepted", { from: socket.id });
    });

    socket.on("call-rejected", () => {
      socket.broadcast.emit("call-rejected", { from: socket.id });
    });

    socket.on("call-ended", () => {
      socket.broadcast.emit("call-ended", { from: socket.id });
    });

    socket.on("call-offer", (data) => {
      socket.to(data.to).emit("call-offer", {
        from: socket.id,
        offer: data.offer,
      });
    });

    socket.on("call-answer", (data) => {
      socket.to(data.to).emit("call-answer", {
        from: socket.id,
        answer: data.answer,
      });
    });

    socket.on("ice-candidate", (data) => {
      socket.to(data.to).emit("ice-candidate", {
        from: socket.id,
        candidate: data.candidate,
      });
    });

    // === GENERAL EVENTS ===
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      socket.broadcast.emit("user-left", socket.id);
    });
  });

  console.log("Socket is set up");
  res.end();
};

export default SocketHandler;
