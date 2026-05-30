"use client";

import { Role, ROLE_LABELS } from "@/features/auth/constants/roles";
import { useSnackbar } from "@/hooks/use-snackbar";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { CreateUserRequest, UpdateUserRequest } from "@/types/auth.types";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRow = {
  id: number;
  email: string;
  username: string | null;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
};

type ListResponse = {
  data: UserRow[];
  meta: { page: number; limit: number; total: number };
};

// ─── Role Chip colors ─────────────────────────────────────────────────────────

const ROLE_CHIP_COLORS: Record<
  Role,
  "default" | "warning" | "info" | "success"
> = {
  [Role.ROOT_ADMIN]: "warning",
  [Role.SCRUM_MASTER]: "info",
  [Role.DEVELOPER]: "success",
  [Role.VIEWER]: "default",
};

// ─── Empty form defaults ───────────────────────────────────────────────────────

const EMPTY_CREATE: CreateUserRequest = {
  email: "",
  name: "",
  username: "",
  password: "",
  role: Role.DEVELOPER,
};

// ─── Component ────────────────────────────────────────────────────────────────

function UsersPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 20;

  // ── Dialogs state ────────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);
  const [resetUser, setResetUser] = useState<UserRow | null>(null);
  const [createForm, setCreateForm] = useState<CreateUserRequest>(EMPTY_CREATE);
  const [editForm, setEditForm] = useState<UpdateUserRequest>({});
  const [newPassword, setNewPassword] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // ── Data loading ─────────────────────────────────────────────────────────────

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL("/api/users", window.location.origin);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", String(limit));
      if (search) url.searchParams.set("search", search);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to load users");

      const data: ListResponse = await res.json();
      setUsers(data.data);
      setTotal(data.meta.total);
    } catch {
      enqueueSnackbar("Failed to load users", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [page, search, enqueueSnackbar]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleCreateSubmit = async () => {
    if (!createForm.email || !createForm.name || !createForm.password) {
      enqueueSnackbar("Email, name, and password are required", {
        variant: "error",
      });
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const json = await res.json();
      if (!res.ok) {
        enqueueSnackbar(json.error ?? "Failed to create user", {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar("User created successfully", { variant: "success" });
      setCreateOpen(false);
      setCreateForm(EMPTY_CREATE);
      loadUsers();
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editUser) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/users/${editUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (!res.ok) {
        enqueueSnackbar(json.error ?? "Failed to update user", {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar("User updated", { variant: "success" });
      setEditUser(null);
      loadUsers();
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (user: UserRow) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (!res.ok) {
        const json = await res.json();
        enqueueSnackbar(json.error ?? "Failed to update status", {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar(
        `User ${!user.isActive ? "enabled" : "disabled"}`,
        { variant: "success" }
      );
      loadUsers();
    } catch {
      enqueueSnackbar("Failed to update status", { variant: "error" });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUser) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/users/${deleteUser.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        enqueueSnackbar(json.error ?? "Failed to delete user", {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar("User deleted", { variant: "success" });
      setDeleteUser(null);
      loadUsers();
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetUser || !newPassword) {
      enqueueSnackbar("New password is required", { variant: "error" });
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`/api/users/${resetUser.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        enqueueSnackbar(json.error ?? "Failed to reset password", {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar("Password reset successfully", { variant: "success" });
      setResetUser(null);
      setNewPassword("");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {total} user{total !== 1 ? "s" : ""} total
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Create User
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, maxWidth: 480 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search by name, email or username…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          slotProps={{
            input: {
              startAdornment: (
                <SearchIcon sx={{ color: "text.disabled", mr: 0.5 }} />
              ),
            },
          }}
        />
        <Button variant="outlined" size="small" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      ) : users.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary">No users found.</Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ROLE_LABELS[user.role] ?? user.role}
                      size="small"
                      color={ROLE_CHIP_COLORS[user.role] ?? "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      size="small"
                      checked={user.isActive}
                      onChange={() => handleToggleActive(user)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditUser(user);
                          setEditForm({
                            name: user.name,
                            username: user.username ?? "",
                            role: user.role,
                          });
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reset password">
                      <IconButton
                        size="small"
                        onClick={() => setResetUser(user)}
                      >
                        <LockResetIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteUser(user)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {total > limit && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 3 }}>
          <Button
            size="small"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <Typography variant="body2" sx={{ lineHeight: "32px" }}>
            Page {page} of {Math.ceil(total / limit)}
          </Typography>
          <Button
            size="small"
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Box>
      )}

      {/* ── Create User Dialog ──────────────────────────────────────────────── */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Create User</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Full Name"
            size="small"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, name: e.target.value }))
            }
          />
          <TextField
            label="Email"
            type="email"
            size="small"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, email: e.target.value }))
            }
          />
          <TextField
            label="Username (optional)"
            size="small"
            value={createForm.username ?? ""}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, username: e.target.value }))
            }
          />
          <TextField
            label="Password"
            type="password"
            size="small"
            value={createForm.password}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, password: e.target.value }))
            }
          />
          <FormControl size="small">
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={createForm.role}
              onChange={(e) =>
                setCreateForm((f) => ({
                  ...f,
                  role: e.target.value as Role,
                }))
              }
            >
              {Object.values(Role).map((r) => (
                <MenuItem key={r} value={r}>
                  {ROLE_LABELS[r]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateSubmit}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={16} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit User Dialog ────────────────────────────────────────────────── */}
      <Dialog
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Full Name"
            size="small"
            value={editForm.name ?? ""}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, name: e.target.value }))
            }
          />
          <TextField
            label="Username"
            size="small"
            value={editForm.username ?? ""}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, username: e.target.value }))
            }
          />
          <FormControl size="small">
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={editForm.role ?? Role.DEVELOPER}
              onChange={(e) =>
                setEditForm((f) => ({
                  ...f,
                  role: e.target.value as Role,
                }))
              }
            >
              {Object.values(Role).map((r) => (
                <MenuItem key={r} value={r}>
                  {ROLE_LABELS[r]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={16} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ───────────────────────────────────────────── */}
      <Dialog
        open={Boolean(deleteUser)}
        onClose={() => setDeleteUser(null)}
        maxWidth="xs"
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete{" "}
            <strong>{deleteUser?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUser(null)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={16} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Reset Password Dialog ───────────────────────────────────────────── */}
      <Dialog
        open={Boolean(resetUser)}
        onClose={() => {
          setResetUser(null);
          setNewPassword("");
        }}
        maxWidth="xs"
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Set a new password for <strong>{resetUser?.name}</strong>.
          </DialogContentText>
          <TextField
            label="New Password"
            type="password"
            size="small"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setResetUser(null);
              setNewPassword("");
            }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleResetPassword}
            disabled={actionLoading || newPassword.length < 8}
          >
            {actionLoading ? <CircularProgress size={16} /> : "Reset"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default withPageRequiredAuth(UsersPage, { roles: [Role.ROOT_ADMIN] });
