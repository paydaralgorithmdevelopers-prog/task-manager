"use client";

import Link from "@/components/link";
import ThemeSwitchButton from "@/components/switch-theme-button";
import { Permission } from "@/features/auth/constants/permissions";
import { usePermission } from "@/features/auth/hooks/use-permission";
import useAuth from "@/services/auth/use-auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import useLanguage from "@/services/i18n/use-language";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";

type NavItem = { label: string; href: string };

function ResponsiveAppBar() {
  const { user, isLoaded } = useAuth();
  const { logOut } = useAuthActions();
  const { can } = usePermission();
  const language = useLanguage();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: `/${language}/dashboard` },
    ...(can(Permission.USER_READ)
      ? [{ label: "Users", href: `/${language}/dashboard/users` }]
      : []),
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo — desktop */}
          <Typography
            variant="h6"
            component={Link}
            href={`/${language}/dashboard`}
            sx={{
              mr: 3,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".15em",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TaskMaster
          </Typography>

          {/* Hamburger — mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="nav-menu-mobile"
              aria-haspopup="true"
              onClick={(e) => setAnchorElNav(e.currentTarget)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="nav-menu-mobile"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {user &&
                navItems.map((item) => (
                  <MenuItem
                    key={item.href}
                    component={Link}
                    href={item.href}
                    onClick={() => setAnchorElNav(null)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              {!user && (
                <MenuItem
                  component={Link}
                  href={`/${language}/login`}
                  onClick={() => setAnchorElNav(null)}
                >
                  Sign In
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Logo — mobile */}
          <Typography
            variant="h6"
            component={Link}
            href={`/${language}/dashboard`}
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontWeight: 700,
              letterSpacing: ".15em",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TaskMaster
          </Typography>

          {/* Desktop nav links */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 0.5 }}>
            {user &&
              navItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  sx={{ color: "inherit", textTransform: "none" }}
                >
                  {item.label}
                </Button>
              ))}
          </Box>

          {/* Theme switch */}
          <Box sx={{ mr: 1 }}>
            <ThemeSwitchButton />
          </Box>

          {/* Auth section */}
          {!isLoaded ? (
            <CircularProgress color="inherit" size={22} />
          ) : user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Account menu">
                <IconButton
                  onClick={(e) => setAnchorElUser(e.currentTarget)}
                  sx={{ p: 0 }}
                  data-testid="profile-menu-item"
                >
                  <Avatar
                    sx={{ width: 32, height: 32, fontSize: 14, bgcolor: "primary.dark" }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="user-menu"
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={() => setAnchorElUser(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2">
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem
                  onClick={() => {
                    logOut();
                    setAnchorElUser(null);
                  }}
                  data-testid="logout-menu-item"
                >
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              component={Link}
              href={`/${language}/login`}
              sx={{ color: "inherit", textTransform: "none" }}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
