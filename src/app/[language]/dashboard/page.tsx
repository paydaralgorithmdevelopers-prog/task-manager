"use client";

import { ROLE_LABELS } from "@/features/auth/constants/roles";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

function DashboardPage() {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Welcome back, {user?.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
          {user?.role && <Chip label={ROLE_LABELS[user.role]} size="small" variant="outlined" />}
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Tasks</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }} color="primary">0</Typography>
            <Typography variant="body2" color="text.secondary">Total assigned tasks</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>In Progress</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }} color="warning.main">0</Typography>
            <Typography variant="body2" color="text.secondary">Active tasks</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Completed</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }} color="success.main">0</Typography>
            <Typography variant="body2" color="text.secondary">Finished tasks</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Overdue</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }} color="error.main">0</Typography>
            <Typography variant="body2" color="text.secondary">Past due date</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(DashboardPage);
