import { Box, Container } from '@mui/material';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoginForm />
      </Box>
    </Container>
  );
}
