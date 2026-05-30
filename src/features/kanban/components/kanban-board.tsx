'use client';

import { Box } from '@mui/material';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './kanban-column';
import { useKanbanStore } from '../store/kanban-store';
import { useEffect } from 'react';

interface KanbanBoardProps {
  projectId: number;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { columns, moveTask } = useKanbanStore();

  const handleDragEnd = (result: DropResult) => {
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

    // TODO: Call API to update task status on server
    // fetch(`/api/tasks/${taskId}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status: destStatus, position: destIndex }),
    // });
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
