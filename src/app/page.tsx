import { Box, Button, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { CheckCircle, Speed, Security, People, Cloud, Zap } from '@mui/icons-material';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      title: 'Kanban Boards',
      description: 'Organize tasks with intuitive drag-and-drop boards',
    },
    {
      icon: <Zap sx={{ fontSize: 40 }} />,
      title: 'Real-time Collaboration',
      description: 'See updates instantly with WebSocket technology',
    },
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'Team Management',
      description: 'Manage teams and permissions with granular RBAC',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'High Performance',
      description: 'Built with Next.js for blazing fast performance',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure by Default',
      description: 'Enterprise-grade security with JWT authentication',
    },
    {
      icon: <Cloud sx={{ fontSize: 40 }} />,
      title: 'Cloud Ready',
      description: 'Deploy anywhere with Docker and PostgreSQL',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.dark}15 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 3,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TaskManager
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
              Enterprise-grade task management platform with real-time collaboration, powerful workflows, and
              beautiful UI
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/signup"
                variant="contained"
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              >
                Get Started Free
              </Button>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" fontWeight={700} gutterBottom>
            Everything you need to manage projects
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Powerful features to help your team collaborate and deliver faster
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, idx) => (
            <Grid item xs={12} md={6} lg={4} key={idx}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '16px',
                      background: (theme) => theme.palette.primary.main + '20',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ py: 12, backgroundColor: (theme) => theme.palette.background.paper }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Ready to get started?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Join thousands of teams already using TaskManager to manage their projects
            </Typography>
            <Button
              component={Link}
              href="/signup"
              variant="contained"
              size="large"
              sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
            >
              Start Free Trial
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
