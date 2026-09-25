"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress
} from "@mui/material"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoggedIn } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Mohon masukkan email dan kata sandi Anda.")
      return
    }

    setLoading(true)
    try {
      const res = await login(email, password)
      if (res.success) {
        setSuccessMsg("Berhasil masuk! Mengarahkan...")
        setTimeout(() => {
          router.push("/")
        }, 1000)
      } else {
        setErrorMsg(res.message || "Email atau password salah.")
      }
    } catch {
      setErrorMsg("Terjadi kesalahan saat menghubungi server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, sm: 8 },
        px: 2,
        background: "linear-gradient(135deg, #F0F4F8 0%, #E2E8F0 100%)"
      }}
    >
      <Container maxWidth="sm">
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 3,
            color: "text.secondary",
            "&:hover": { color: "primary.main" }
          }}
        >
          Kembali ke Beranda
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 12px 32px rgba(14, 99, 156, 0.08)",
            bgcolor: "background.paper"
          }}
        >
          {/* Logo & Header */}
          <Stack
            alignItems="center"
            spacing={1}
            sx={{ mb: 4, textAlign: "center" }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                mb: 1
              }}
            >
              <StoreOutlinedIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              Masuk ke TokoKu
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Kelola belanja dan temukan produk terbaik untuk Anda
            </Typography>
          </Stack>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {successMsg && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {successMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Alamat Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Kata Sandi"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Ingat Saya
                    </Typography>
                  }
                />
                <Typography
                  component={Link}
                  href="#"
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": { textDecoration: "underline" }
                  }}
                >
                  Lupa kata sandi?
                </Typography>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.4,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Masuk"
                )}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3.5 }}>
            <Typography variant="caption" color="text.secondary">
              ATAU
            </Typography>
          </Divider>

          <Stack direction="row" justifyContent="center" spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Belum punya akun?
            </Typography>
            <Typography
              component={Link}
              href="/register"
              variant="body2"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" }
              }}
            >
              Daftar Sekarang
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
