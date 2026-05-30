import { Box, Container } from '@mui/material';
import { SignupForm } from '@/features/auth/components/signup-form';

export default function SignupPage() {
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
        <SignupForm />
      </Box>
    </Container>
  );
}
