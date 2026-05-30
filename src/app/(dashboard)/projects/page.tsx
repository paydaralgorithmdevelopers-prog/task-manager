'use client';

import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon, Folder as FolderIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProjectsPage() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Mock data
  const projects = [
    {
      id: 1,
      name: 'Website Redesign',
      key: 'WEB',
      description: 'Complete redesign of the company website with modern UI/UX',
      status: 'active',
      type: 'software',
      members: ['A', 'B', 'C', 'D'],
      taskCount: 24,
      completedTasks: 18,
    },
    {
      id: 2,
      name: 'Mobile App',
      key: 'MOB',
      description: 'Native mobile application for iOS and Android',
      status: 'active',
      type: 'software',
      members: ['E', 'F', 'G'],
      taskCount: 32,
      completedTasks: 14,
    },
    {
      id: 3,
      name: 'API Development',
      key: 'API',
      description: 'RESTful API for backend services',
      status: 'active',
      type: 'software',
      members: ['H', 'I', 'J', 'K', 'L'],
      taskCount: 18,
      completedTasks: 16,
    },
    {
      id: 4,
      name: 'Marketing Campaign',
      key: 'MKT',
      description: 'Q2 marketing campaign planning and execution',
      status: 'planning',
      type: 'marketing',
      members: ['M', 'N'],
      taskCount: 12,
      completedTasks: 3,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'planning':
        return 'info';
      case 'on_hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Projects
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track all your projects in one place
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease',
                },
              }}
              onClick={() => router.push(`/projects/${project.id}/board`)}
            >
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        backgroundColor: (theme) => theme.palette.primary.main + '20',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FolderIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {project.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {project.key}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={project.status} size="small" color={getStatusColor(project.status)} />
                  <Chip label={project.type} size="small" variant="outlined" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {project.completedTasks}/{project.taskCount} tasks
                  </Typography>
                  <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
                    {project.members.map((member, idx) => (
                      <Avatar key={idx}>{member}</Avatar>
                    ))}
                  </AvatarGroup>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Edit Project</MenuItem>
        <MenuItem onClick={handleMenuClose}>Project Settings</MenuItem>
        <MenuItem onClick={handleMenuClose}>View Members</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Archive Project
        </MenuItem>
      </Menu>
    </Box>
  );
}
