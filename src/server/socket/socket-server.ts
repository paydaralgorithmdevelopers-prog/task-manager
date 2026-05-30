import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';
import { userRepository } from '../repositories/user.repository';

export interface AuthenticatedSocket extends Socket {
  userId: number;
  email: string;
}

interface UserPresence {
  userId: number;
  email: string;
  fullName: string | null;
  projectId?: number;
  status: 'online' | 'away' | 'busy';
  lastSeen: Date;
}

class SocketServer {
  private io: SocketIOServer | null = null;
  private userPresence: Map<number, UserPresence> = new Map();
  private projectRooms: Map<number, Set<number>> = new Map();

  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.setupMiddleware();
    this.setupConnectionHandler();

    console.log('✅ Socket.IO server initialized');
  }

  private setupMiddleware() {
    if (!this.io) return;

    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          return next(new Error('Authentication required'));
        }

        const payload = verifyAccessToken(token);
        if (!payload) {
          return next(new Error('Invalid token'));
        }

        const user = await userRepository.findById(payload.userId);
        if (!user) {
          return next(new Error('User not found'));
        }

        // Attach user info to socket
        (socket as AuthenticatedSocket).userId = user.id;
        (socket as AuthenticatedSocket).email = user.email;

        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupConnectionHandler() {
    if (!this.io) return;

    this.io.on('connection', async (socket: Socket) => {
      const authSocket = socket as AuthenticatedSocket;
      const { userId, email } = authSocket;

      console.log(`User connected: ${email} (${userId})`);

      // Get user details
      const user = await userRepository.findById(userId);

      // Update user presence
      const presence: UserPresence = {
        userId,
        email,
        fullName: user?.fullName || null,
        status: 'online',
        lastSeen: new Date(),
      };
      this.userPresence.set(userId, presence);

      // Notify others about user online status
      this.io?.emit('user:status', { userId, status: 'online' });

      // Handle joining project rooms
      socket.on('project:join', (projectId: number) => {
        this.handleProjectJoin(authSocket, projectId);
      });

      // Handle leaving project rooms
      socket.on('project:leave', (projectId: number) => {
        this.handleProjectLeave(authSocket, projectId);
      });

      // Handle task updates
      socket.on('task:update', (data) => {
        this.handleTaskUpdate(authSocket, data);
      });

      // Handle task creation
      socket.on('task:create', (data) => {
        this.handleTaskCreate(authSocket, data);
      });

      // Handle task deletion
      socket.on('task:delete', (data) => {
        this.handleTaskDelete(authSocket, data);
      });

      // Handle task move (drag and drop)
      socket.on('task:move', (data) => {
        this.handleTaskMove(authSocket, data);
      });

      // Handle typing indicators
      socket.on('comment:typing', (data) => {
        this.handleTyping(authSocket, data);
      });

      // Handle user presence updates
      socket.on('presence:update', (status: 'online' | 'away' | 'busy') => {
        this.handlePresenceUpdate(authSocket, status);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(authSocket);
      });
    });
  }

  private handleProjectJoin(socket: AuthenticatedSocket, projectId: number) {
    const roomName = `project:${projectId}`;
    socket.join(roomName);

    // Track user in project room
    if (!this.projectRooms.has(projectId)) {
      this.projectRooms.set(projectId, new Set());
    }
    this.projectRooms.get(projectId)?.add(socket.userId);

    // Update presence
    const presence = this.userPresence.get(socket.userId);
    if (presence) {
      presence.projectId = projectId;
      this.userPresence.set(socket.userId, presence);
    }

    // Get all users in this project room
    const usersInRoom = Array.from(this.projectRooms.get(projectId) || [])
      .map((userId) => this.userPresence.get(userId))
      .filter(Boolean);

    // Notify user about others in the room
    socket.emit('project:users', usersInRoom);

    // Notify others that user joined
    socket.to(roomName).emit('project:user-joined', {
      userId: socket.userId,
      email: socket.email,
    });

    console.log(`User ${socket.email} joined project ${projectId}`);
  }

  private handleProjectLeave(socket: AuthenticatedSocket, projectId: number) {
    const roomName = `project:${projectId}`;
    socket.leave(roomName);

    // Remove user from project room tracking
    this.projectRooms.get(projectId)?.delete(socket.userId);

    // Update presence
    const presence = this.userPresence.get(socket.userId);
    if (presence) {
      presence.projectId = undefined;
      this.userPresence.set(socket.userId, presence);
    }

    // Notify others that user left
    socket.to(roomName).emit('project:user-left', {
      userId: socket.userId,
    });

    console.log(`User ${socket.email} left project ${projectId}`);
  }

  private handleTaskUpdate(socket: AuthenticatedSocket, data: any) {
    const { projectId, task } = data;
    const roomName = `project:${projectId}`;

    // Broadcast to all users in the project room except sender
    socket.to(roomName).emit('task:updated', {
      task,
      updatedBy: {
        userId: socket.userId,
        email: socket.email,
      },
    });
  }

  private handleTaskCreate(socket: AuthenticatedSocket, data: any) {
    const { projectId, task } = data;
    const roomName = `project:${projectId}`;

    // Broadcast to all users in the project room except sender
    socket.to(roomName).emit('task:created', {
      task,
      createdBy: {
        userId: socket.userId,
        email: socket.email,
      },
    });
  }

  private handleTaskDelete(socket: AuthenticatedSocket, data: any) {
    const { projectId, taskId } = data;
    const roomName = `project:${projectId}`;

    // Broadcast to all users in the project room except sender
    socket.to(roomName).emit('task:deleted', {
      taskId,
      deletedBy: {
        userId: socket.userId,
        email: socket.email,
      },
    });
  }

  private handleTaskMove(socket: AuthenticatedSocket, data: any) {
    const { projectId, taskId, sourceStatus, destStatus, destIndex } = data;
    const roomName = `project:${projectId}`;

    // Broadcast to all users in the project room except sender
    socket.to(roomName).emit('task:moved', {
      taskId,
      sourceStatus,
      destStatus,
      destIndex,
      movedBy: {
        userId: socket.userId,
        email: socket.email,
      },
    });
  }

  private handleTyping(socket: AuthenticatedSocket, data: any) {
    const { projectId, taskId, isTyping } = data;
    const roomName = `project:${projectId}`;

    socket.to(roomName).emit('comment:typing', {
      taskId,
      isTyping,
      user: {
        userId: socket.userId,
        email: socket.email,
      },
    });
  }

  private handlePresenceUpdate(socket: AuthenticatedSocket, status: 'online' | 'away' | 'busy') {
    const presence = this.userPresence.get(socket.userId);
    if (presence) {
      presence.status = status;
      presence.lastSeen = new Date();
      this.userPresence.set(socket.userId, presence);

      // Notify all connected clients
      this.io?.emit('user:status', {
        userId: socket.userId,
        status,
      });
    }
  }

  private handleDisconnect(socket: AuthenticatedSocket) {
    console.log(`User disconnected: ${socket.email} (${socket.userId})`);

    // Update presence
    const presence = this.userPresence.get(socket.userId);
    if (presence) {
      presence.status = 'online';
      presence.lastSeen = new Date();
      this.userPresence.set(socket.userId, presence);
    }

    // Remove from all project rooms
    this.projectRooms.forEach((users, projectId) => {
      if (users.has(socket.userId)) {
        users.delete(socket.userId);
        this.io?.to(`project:${projectId}`).emit('project:user-left', {
          userId: socket.userId,
        });
      }
    });

    // Notify others about offline status
    this.io?.emit('user:status', {
      userId: socket.userId,
      status: 'offline',
    });
  }

  getIO(): SocketIOServer | null {
    return this.io;
  }

  getUserPresence(): Map<number, UserPresence> {
    return this.userPresence;
  }
}

export const socketServer = new SocketServer();
