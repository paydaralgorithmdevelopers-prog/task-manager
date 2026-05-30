'use client';

import { KanbanBoard } from '@/features/kanban/components/kanban-board';
import { Add as AddIcon, FilterList as FilterIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { Box, Breadcrumbs, Button, Chip, Link, Typography } from '@mui/material';
import { use } from 'react';

interface BoardPageProps {
  params: Promise<{ projectId: string }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const { projectId } = use(params);

  // Mock project data
  const project = {
    id: parseInt(projectId),
    name: 'Website Redesign',
    key: 'WEB',
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/projects">
          Projects
        </Link>
        <Typography color="text.primary">{project.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {project.name}
          </Typography>
          <Chip label={project.key} size="small" />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<FilterIcon />}>
            Filter
          </Button>
          <Button variant="outlined" startIcon={<SettingsIcon />}>
            Settings
          </Button>
          <Button variant="contained" startIcon={<AddIcon />}>
            New Task
          </Button>
        </Box>
      </Box>

      {/* Kanban Board */}
      <KanbanBoard projectId={project.id} />
    </Box>
  );
}
