'use client';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import { TrendingUp, Assignment, CheckCircle, Schedule } from '@mui/icons-material';

export default function DashboardPage() {
  // Mock data
  const stats = [
    { label: 'Total Tasks', value: 42, icon: <Assignment />, color: '#3B82F6' },
    { label: 'Completed', value: 28, icon: <CheckCircle />, color: '#10B981' },
    { label: 'In Progress', value: 10, icon: <Schedule />, color: '#F59E0B' },
    { label: 'Productivity', value: '85%', icon: <TrendingUp />, color: '#8B5CF6' },
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'Website Redesign',
      progress: 75,
      tasks: { total: 24, completed: 18 },
      members: ['A', 'B', 'C'],
      status: 'On Track',
    },
    {
      id: 2,
      name: 'Mobile App',
      progress: 45,
      tasks: { total: 32, completed: 14 },
      members: ['D', 'E'],
      status: 'In Progress',
    },
    {
      id: 3,
      name: 'API Development',
      progress: 90,
      tasks: { total: 18, completed: 16 },
      members: ['F', 'G', 'H', 'I'],
      status: 'Almost Done',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Here's what's happening with your projects today.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: stat.color + '20',
                      color: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Projects */}
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Recent Projects
      </Typography>
      <Grid container spacing={3}>
        {recentProjects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {project.name}
                  </Typography>
                  <Chip label={project.status} size="small" color="primary" />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {project.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={project.progress} sx={{ borderRadius: 1, height: 6 }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {project.tasks.completed}/{project.tasks.total} tasks
                  </Typography>
                  <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
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
    </Box>
  );
}
