'use client';

import { Box, Typography, Paper } from '@mui/material';
import { Column as ColumnType } from '../types/kanban.types';
import { TaskCard } from './task-card';
import { Droppable } from '@hello-pangea/dnd';

interface KanbanColumnProps {
  column: ColumnType;
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  return (
    <Box
      sx={{
        minWidth: 300,
        maxWidth: 300,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Column Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
            {column.title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {column.tasks.length}
          </Typography>
        </Box>
      </Paper>

      {/* Column Content */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flex: 1,
              minHeight: 200,
              p: 1,
              backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
              borderRadius: 2,
              transition: 'background-color 0.2s ease',
            }}
          >
            {column.tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
}
