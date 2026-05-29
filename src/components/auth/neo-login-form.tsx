"use client";

import { LoginRequest } from "@/types/auth.types";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function NeoLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Login failed");
        return;
      }

      // Store tokens
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        position: "relative",
        overflow: "hidden",

        // Neo brutalist styling
        "&::before": {
          content: '""',
          position: "absolute",
          width: "400px",
          height: "400px",
          background: "rgba(255, 0, 127, 0.15)",
          borderRadius: "50%",
          top: "-50px",
          right: "-50px",
          filter: "blur(80px)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "400px",
          height: "400px",
          background: "rgba(0, 255, 255, 0.15)",
          borderRadius: "50%",
          bottom: "-50px",
          left: "-50px",
          filter: "blur(80px)",
        },
      }}
    >
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            position: "relative",
            zIndex: 1,
            padding: "48px",
            border: "2px solid #ffffff",
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            transition: "all 0.3s ease",
            borderRadius: "20px",

            "&:hover": {
              boxShadow: "0 0 30px rgba(255, 0, 127, 0.3), inset 0 0 20px rgba(255, 0, 127, 0.1)",
              borderColor: "#ff007f",
            },
          }}
        >
          {/* Logo/Header */}
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                background: "linear-gradient(90deg, #ff007f, #00ffff)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Poppins', 'Inter', sans-serif",
                mb: 1,
              }}
            >
              TASK<br/>MASTER
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.15em",
                color: "#00ffff",
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            >
              Team Collaboration System
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                background: "rgba(255, 0, 0, 0.1)",
                border: "1px solid #ff4444",
                color: "#ff4444",
                "& .MuiAlert-icon": {
                  color: "#ff4444",
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                type="email"
                disabled={loading}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  mb: 3,
                  "& .MuiInputBase-input": {
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    color: "#ffffff",
                    textTransform: "lowercase",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    border: "1px solid #333333",
                    background: "rgba(255, 255, 255, 0.05)",
                    transition: "all 0.3s ease",

                    "&:hover": {
                      borderColor: "#00ffff",
                      background: "rgba(0, 255, 255, 0.05)",
                    },
                    "&.Mui-focused": {
                      borderColor: "#ff007f",
                      background: "rgba(255, 0, 127, 0.08)",
                      boxShadow: "0 0 12px rgba(255, 0, 127, 0.2)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    color: "#999999",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",

                    "&.Mui-focused": {
                      color: "#ff007f",
                    },
                  },
                }}
              />
            )}
          />

          {/* Password Field */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                disabled={loading}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  mb: 1,
                  "& .MuiInputBase-input": {
                    fontFamily: '"Courier New", monospace',
                    fontSize: "14px",
                    color: "#ffffff",
                  },
                  "& .MuiOutlinedInput-root": {
                    border: "1px solid #333333",
                    background: "rgba(255, 255, 255, 0.05)",
                    transition: "all 0.3s ease",

                    "&:hover": {
                      borderColor: "#00ffff",
                      background: "rgba(0, 255, 255, 0.05)",
                    },
                    "&.Mui-focused": {
                      borderColor: "#ff007f",
                      background: "rgba(255, 0, 127, 0.08)",
                      boxShadow: "0 0 12px rgba(255, 0, 127, 0.2)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: '"Courier New", monospace',
                    fontSize: "12px",
                    color: "#999999",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",

                    "&.Mui-focused": {
                      color: "#ff007f",
                    },
                  },
                }}
              />
            )}
          />

          {/* Show Password Toggle */}
          <Box sx={{ mb: 3, textAlign: "right" }}>
            <MuiLink
              component="button"
              type="button"
              variant="caption"
              onClick={() => setShowPassword(!showPassword)}
              sx={{
                fontFamily: '"Courier New", monospace',
                fontSize: "11px",
                color: "#00ffff",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                textDecoration: "none",

                "&:hover": {
                  color: "#ff007f",
                  textDecoration: "underline",
                },
              }}
            >
              {showPassword ? "Hide" : "Show"} Password
            </MuiLink>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              mb: 3,
              py: 2,
              fontFamily: '"Courier New", monospace',
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "linear-gradient(90deg, #ff007f, #ff0080)",
              color: "#000000",
              border: "2px solid #ff007f",
              transition: "all 0.3s ease",

              "&:hover": {
                background: "linear-gradient(90deg, #ff0080, #ff007f)",
                boxShadow: "0 0 20px rgba(255, 0, 127, 0.6), inset 0 0 20px rgba(255, 0, 127, 0.2)",
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0px)",
              },
              "&:disabled": {
                opacity: 0.6,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "#000000" }} />
            ) : (
              "ENTER SYSTEM"
            )}
          </Button>

          {/* Footer */}
          <Box sx={{ textAlign: "center", borderTop: "1px solid #333333", pt: 3 }}>
            <Typography
              sx={{
                fontSize: "11px",
                fontFamily: '"Courier New", monospace',
                color: "#666666",
                letterSpacing: "0.05em",
              }}
            >
              Don't have an account?{" "}
              <MuiLink
                href="/sign-up"
                sx={{
                  color: "#00ffff",
                  textDecoration: "none",
                  fontWeight: 600,

                  "&:hover": {
                    color: "#ff007f",
                    textDecoration: "underline",
                  },
                }}
              >
                Create one
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
