'use client';

import { Box, Typography, Chip } from '@mui/material';
import { Card } from '@/shared/components/ui/card';
import { Task } from '../types/kanban.types';
import { Draggable } from '@hello-pangea/dnd';

interface TaskCardProps {
  task: Task;
  index: number;
}

const PRIORITY_COLORS = {
  low: '#6B7280',
  medium: '#3B82F6',
  high: '#F59E0B',
  critical: '#EF4444',
};

const TYPE_COLORS = {
  feature: '#8B5CF6',
  bug: '#EF4444',
  chore: '#6B7280',
  improvement: '#3B82F6',
  tech_debt: '#F59E0B',
};

export function TaskCard({ task, index }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            mb: 1.5,
            cursor: 'grab',
            opacity: snapshot.isDragging ? 0.8 : 1,
            transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: 3,
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={task.key}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: '20px',
                }}
              />
              <Chip
                label={task.type}
                size="small"
                sx={{
                  backgroundColor: TYPE_COLORS[task.type],
                  color: 'white',
                  fontSize: '0.7rem',
                  height: '20px',
                  textTransform: 'capitalize',
                }}
              />
            </Box>

            {/* Title */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {task.title}
            </Typography>

            {/* Footer */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: PRIORITY_COLORS[task.priority],
                  }}
                />
              </Box>
              {task.storyPoints && (
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  {task.storyPoints} pts
                </Typography>
              )}
            </Box>
          </Box>
        </Card>
      )}
    </Draggable>
  );
}
