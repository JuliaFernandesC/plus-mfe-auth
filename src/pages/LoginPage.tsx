import { useState, useCallback } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { UnderlineField } from "../components/underline-field/underline-field";
import { AlertBanner }    from "../components/alert-banner/alert-banner";
import { useLoginForm }   from "../hooks/login/useLoginForm";
import type { LoginResponse } from "../types/auth";

const API = import.meta.env.VITE_MS_AUTH_URL || "http://localhost:3001";

interface LoginPageProps {
  onLogin?: (data: LoginResponse) => void;
}

function BackgroundBlobs() {
  const blob = (sx: object) => (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        borderRadius: "50%",
        pointerEvents: "none",
        ...sx,
      }}
    />
  );
  return (
    <>
      {blob({ top: -80, right: -80, width: 280, height: 280, background: "rgba(255,255,255,0.13)" })}
      {blob({ bottom: -100, left: -100, width: 340, height: 340, background: "rgba(255,255,255,0.10)" })}
      {blob({ bottom: 30, left: 10, width: 170, height: 170, background: "rgba(255,255,255,0.09)" })}
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogin = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setAuthError(null);
      const res = await fetch(`${API}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error || "Erro ao fazer login");
      }

      const data: LoginResponse = await res.json();
      localStorage.setItem("token",   data.token);
      localStorage.setItem("refresh", data.refresh);
      onLogin?.(data);
    },
    [onLogin]
  );

  const {
    values, errors, touched, isSubmitting,
    fieldValid, handleChange, handleBlur, handleSubmit,
  } = useLoginForm({ onSubmit: handleLogin });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #7B74F5 0%, #5E56E8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <BackgroundBlobs />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 460,
          background: "rgba(248, 248, 255, 0.93)",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          p: { xs: "36px 28px", sm: "48px 52px" },
          boxShadow: "0 8px 48px rgba(70, 60, 200, 0.22)",
          overflow: "hidden",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute", top: -50, right: -50,
            width: 170, height: 170,
            borderRadius: "50%",
            background: "rgba(108, 99, 255, 0.07)",
            pointerEvents: "none",
          }}
        />

        <Typography
          variant="h4"
          align="center"
          fontWeight={700}
          sx={{ color: "#4a42c8", mb: 0.75, fontSize: { xs: "1.6rem", sm: "1.9rem" } }}
        >
          Entrar
        </Typography>
        <Typography align="center" sx={{ color: "#9898b3", fontSize: "0.875rem", mb: 3 }}>
          Bem-vindo de volta!
        </Typography>

        <AlertBanner
          message={authError}
          severity="error"
          onClose={() => setAuthError(null)}
        />

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={() => {/* TODO: Auth Google */}}
          sx={{
            py: "11px",
            borderRadius: 50,
            borderColor: "#e0e0f0",
            color: "#6C63FF",
            fontWeight: 600,
            fontSize: "0.9rem",
            backgroundColor: "#fff",
            "&:hover": { borderColor: "#6C63FF", backgroundColor: "#f5f5ff" },
          }}
        >
          Usar conta Google
        </Button>

        <Divider sx={{ my: 2.5 }}>
          <Typography variant="caption" sx={{ color: "#b0b0c8", px: 1, fontSize: "0.78rem" }}>
            ou
          </Typography>
        </Divider>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3.5}>

            <UnderlineField
              id="email"
              label="E-mail"
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              error={Boolean(touched.email && errors.email)}
              helperText={errors.email}
              autoComplete="email"
              autoFocus
              endAdornment={
                fieldValid("email")
                  ? <CheckCircleIcon sx={{ color: "#6C63FF", fontSize: 20 }} />
                  : null
              }
            />

            <UnderlineField
              id="password"
              label="Senha"
              type="password"
              value={values.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              error={Boolean(touched.password && errors.password)}
              helperText={errors.password}
              autoComplete="current-password"
              endAdornment={
                fieldValid("password")
                  ? <CheckCircleIcon sx={{ color: "#6C63FF", fontSize: 20 }} />
                  : null
              }
            />

            <Box sx={{ textAlign: "right", mt: "-12px !important" }}>
              <Link
                href="/forgot-password"
                sx={{
                  fontSize: "0.78rem",
                  color: "#6C63FF",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Esqueceu a senha?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{
                py: "13px",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: "0.9375rem",
                background: "linear-gradient(90deg, #6C63FF 0%, #7B74F5 100%)",
                boxShadow: "0 4px 20px rgba(108, 99, 255, 0.4)",
                "&:hover": {
                  background: "linear-gradient(90deg, #5A52E0 0%, #6C63FF 100%)",
                  boxShadow: "0 6px 28px rgba(108, 99, 255, 0.5)",
                },
                "&.Mui-disabled": { opacity: 0.7, color: "#fff" },
              }}
            >
              {isSubmitting && (
                <CircularProgress size={16} color="inherit" sx={{ mr: 1.25 }} />
              )}
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </Stack>
        </Box>

        <Typography align="center" sx={{ mt: 3.5, fontSize: "0.875rem", color: "#9898b3" }}>
          Não tem uma conta?{" "}
          <Link
            href="/register"
            sx={{
              color: "#6C63FF",
              fontWeight: 700,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Criar conta
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}