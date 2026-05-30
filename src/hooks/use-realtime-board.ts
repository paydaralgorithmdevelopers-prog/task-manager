import { useEffect } from 'react';
import { useSocket } from '@/server/socket/socket-client';
import { useKanbanStore } from '@/features/kanban/store/kanban-store';

interface TaskUpdateEvent {
  task: any;
  updatedBy: {
    userId: number;
    email: string;
  };
}

interface TaskCreateEvent {
  task: any;
  createdBy: {
    userId: number;
    email: string;
  };
}

interface TaskDeleteEvent {
  taskId: number;
  deletedBy: {
    userId: number;
    email: string;
  };
}

interface TaskMoveEvent {
  taskId: number;
  sourceStatus: string;
  destStatus: string;
  destIndex: number;
  movedBy: {
    userId: number;
    email: string;
  };
}

export function useRealtimeBoard(projectId: number) {
  const { socket, isConnected, joinProject, leaveProject } = useSocket();
  const { updateTask, addTask, removeTask, moveTask } = useKanbanStore();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join project room
    joinProject(projectId);

    // Listen for task updates
    const handleTaskUpdate = (event: TaskUpdateEvent) => {
      updateTask(event.task.id, event.task);
    };

    // Listen for task creation
    const handleTaskCreate = (event: TaskCreateEvent) => {
      addTask(event.task);
    };

    // Listen for task deletion
    const handleTaskDelete = (event: TaskDeleteEvent) => {
      removeTask(event.taskId);
    };

    // Listen for task moves
    const handleTaskMove = (event: TaskMoveEvent) => {
      moveTask(event.taskId, event.sourceStatus, event.destStatus, event.destIndex);
    };

    // Register event listeners
    socket.on('task:updated', handleTaskUpdate);
    socket.on('task:created', handleTaskCreate);
    socket.on('task:deleted', handleTaskDelete);
    socket.on('task:moved', handleTaskMove);

    // Cleanup
    return () => {
      socket.off('task:updated', handleTaskUpdate);
      socket.off('task:created', handleTaskCreate);
      socket.off('task:deleted', handleTaskDelete);
      socket.off('task:moved', handleTaskMove);
      leaveProject(projectId);
    };
  }, [socket, isConnected, projectId, joinProject, leaveProject, updateTask, addTask, removeTask, moveTask]);

  // Function to emit task move event
  const emitTaskMove = (taskId: number, sourceStatus: string, destStatus: string, destIndex: number) => {
    if (socket && isConnected) {
      socket.emit('task:move', {
        projectId,
        taskId,
        sourceStatus,
        destStatus,
        destIndex,
      });
    }
  };

  // Function to emit task update event
  const emitTaskUpdate = (task: any) => {
    if (socket && isConnected) {
      socket.emit('task:update', {
        projectId,
        task,
      });
    }
  };

  // Function to emit task create event
  const emitTaskCreate = (task: any) => {
    if (socket && isConnected) {
      socket.emit('task:create', {
        projectId,
        task,
      });
    }
  };

  // Function to emit task delete event
  const emitTaskDelete = (taskId: number) => {
    if (socket && isConnected) {
      socket.emit('task:delete', {
        projectId,
        taskId,
      });
    }
  };

  return {
    isConnected,
    emitTaskMove,
    emitTaskUpdate,
    emitTaskCreate,
    emitTaskDelete,
  };
}
