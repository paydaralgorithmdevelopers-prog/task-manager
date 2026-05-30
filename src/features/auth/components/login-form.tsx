"use client";

import useAuthActions from "@/services/auth/use-auth-actions";
import useLanguage from "@/services/i18n/use-language";
import { AuthUser, LoginRequest } from "@/types/auth.types";
import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  rememberMe: yup.boolean(),
});

type FormValues = yup.InferType<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = useLanguage();
  const { setUser } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
        } satisfies LoginRequest),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Login failed");
        return;
      }

      setUser(json.user as AuthUser);

      const returnTo =
        searchParams.get("returnTo") ?? `/${language}/dashboard`;
      router.replace(returnTo);
    } catch {
      toast.error("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0a0a0a",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        method="POST"
        noValidate
        sx={{
          width: "100%",
          maxWidth: 400,
          mx: 2,
          px: { xs: 3, sm: 4 },
          py: { xs: 4, sm: 5 },
          bgcolor: "#111111",
          border: "1px solid #1f1f1f",
          borderRadius: 2,
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              mb: 0.5,
            }}
          >
            TaskMaster
          </Typography>
          <Typography variant="body2" sx={{ color: "#555" }}>
            Sign in to your workspace
          </Typography>
        </Box>

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
              disabled={isSubmitting}
              error={!!errors.email}
              helperText={errors.email?.message}
              size="small"
              sx={fieldSx}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(onSubmit)();
              }}
            />
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={isSubmitting}
              error={!!errors.password}
              helperText={errors.password?.message}
              size="small"
              sx={{ ...fieldSx, mt: 2 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        tabIndex={-1}
                        sx={{ color: "#555" }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(onSubmit)();
              }}
            />
          )}
        />

        {/* Remember Me */}
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  size="small"
                  disabled={isSubmitting}
                  sx={{
                    color: "#333",
                    "&.Mui-checked": { color: "#e0e0e0" },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#777" }}>
                  Remember me
                </Typography>
              }
              sx={{ mt: 1.5, ml: -0.5 }}
            />
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          sx={{
            mt: 3,
            py: 1.25,
            bgcolor: "#ffffff",
            color: "#000000",
            fontWeight: 600,
            fontSize: "0.875rem",
            letterSpacing: "0.01em",
            borderRadius: 1.5,
            textTransform: "none",
            "&:hover": { bgcolor: "#e0e0e0" },
            "&:disabled": { bgcolor: "#1f1f1f", color: "#444" },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={18} sx={{ color: "#444" }} />
          ) : (
            "Sign in"
          )}
        </Button>
      </Box>
    </Box>
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#0a0a0a",
    color: "#e0e0e0",
    "& fieldset": { borderColor: "#1f1f1f" },
    "&:hover fieldset": { borderColor: "#333" },
    "&.Mui-focused fieldset": { borderColor: "#555" },
    "&.Mui-disabled": { bgcolor: "#0a0a0a" },
  },
  "& .MuiInputLabel-root": { color: "#555" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#888" },
  "& .MuiFormHelperText-root": { color: "#e57373" },
  "& .MuiInputBase-input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #0a0a0a inset",
    WebkitTextFillColor: "#e0e0e0",
  },
};
