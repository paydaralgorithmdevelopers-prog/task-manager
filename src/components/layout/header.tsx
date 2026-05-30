'use client';

import {
    Notifications as NotificationsIcon,
    Search as SearchIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { AppBar, Badge, Box, IconButton, InputAdornment, TextField, Toolbar } from '@mui/material';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        left: { sm: 260 },
        width: { sm: 'calc(100% - 260px)' },
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar>
        {/* Search Bar */}
        <TextField
          placeholder="Search tasks, projects..."
          size="small"
          sx={{
            width: { xs: '100%', sm: 400 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={() => router.push('/notifications')}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={() => router.push('/settings')}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
