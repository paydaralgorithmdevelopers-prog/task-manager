'use client';

import { Box } from '@mui/material';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './kanban-column';
import { useKanbanStore } from '../store/kanban-store';
import { useRealtimeBoard } from '@/hooks/use-realtime-board';

interface KanbanBoardProps {
  projectId: number;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { columns, moveTask } = useKanbanStore();
  const { emitTaskMove } = useRealtimeBoard(projectId);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    // Dropped in the same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const taskId = parseInt(draggableId);
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;
    const destIndex = destination.index;

    // Update local state immediately (optimistic update)
    moveTask(taskId, sourceStatus, destStatus, destIndex);

    // Emit real-time event
    emitTaskMove(taskId, sourceStatus, destStatus, destIndex);

    // Call API to update task status on server
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: destStatus, position: destIndex }),
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      // Optionally revert the optimistic update on error
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          minHeight: '70vh',
        }}
      >
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </Box>
    </DragDropContext>
  );
}
