"use client"

import { useState, useRef, useEffect } from "react"
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
  CircularProgress,
  Chip
} from "@mui/material"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined"
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined"
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import { useAuth } from "../context/AuthContext"

export default function RegisterPage() {
  const router = useRouter()
  const { requestRegister, verifyRegister, resendCode } = useAuth()

  // State Step: 1 = Form Input, 2 = OTP Verification
  const [step, setStep] = useState<1 | 2>(1)

  // Form Fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)

  // OTP Fields (6 digits)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([])

  // Resend Timer
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // UI Status
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  // Timer countdown effect for step 2
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  // Step 1: Submit Form to Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setErrorMsg("Mohon lengkapi semua kolom pendaftaran.")
      return
    }

    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal harus 6 karakter.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.")
      return
    }

    if (!agreeTerms) {
      setErrorMsg("Anda harus menyetujui Syarat & Ketentuan kami.")
      return
    }

    setLoading(true)
    try {
      const res = await requestRegister(name, email, password)
      if (res.success) {
        setStep(2)
        setTimer(60)
        setCanResend(false)
        setOtp(["", "", "", "", "", ""])
        setSuccessMsg("Kode verifikasi 6 digit telah dikirim ke email Anda!")
        setTimeout(() => {
          otpInputsRef.current[0]?.focus()
        }, 100)
      } else {
        setErrorMsg(res.message || "Gagal memproses pendaftaran.")
      }
    } catch {
      setErrorMsg("Terjadi kesalahan koneksi ke server.")
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)
      otpInputsRef.current[5]?.focus()
    }
  }

  // Step 2: Submit OTP for Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    const fullCode = otp.join("")
    if (fullCode.length !== 6) {
      setErrorMsg("Mohon masukkan 6 digit kode verifikasi dengan lengkap.")
      return
    }

    setLoading(true)
    try {
      const res = await verifyRegister(email, fullCode)
      if (res.success) {
        setSuccessMsg(
          "Email berhasil diverifikasi! Akun Anda aktif. Mengarahkan..."
        )
        setTimeout(() => {
          router.push("/")
        }, 1200)
      } else {
        setErrorMsg(
          res.message || "Kode verifikasi salah atau sudah kadaluarsa."
        )
      }
    } catch {
      setErrorMsg("Terjadi kesalahan saat verifikasi kode.")
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP Code
  const handleResendCode = async () => {
    if (!canResend || loading) return
    setErrorMsg("")
    setSuccessMsg("")
    setLoading(true)

    try {
      const res = await resendCode(email)
      if (res.success) {
        setTimer(60)
        setCanResend(false)
        setOtp(["", "", "", "", "", ""])
        setSuccessMsg("Kode verifikasi baru telah dikirimkan ke email Anda!")
        otpInputsRef.current[0]?.focus()
      } else {
        setErrorMsg(res.message || "Gagal mengirim ulang kode verifikasi.")
      }
    } catch {
      setErrorMsg("Terjadi kesalahan koneksi.")
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
          {step === 1 ? (
            /* STEP 1: FORM REGISTER */
            <>
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
                  Daftar Akun Baru
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Bergabunglah dengan TokoKu untuk pengalaman belanja terbaik
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

              <Box component="form" onSubmit={handleRequestOtp} noValidate>
                <Stack spacing={2.5}>
                  <TextField
                    label="Nama Lengkap"
                    type="text"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon color="action" fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />

                  <TextField
                    label="Alamat Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    helperText="Kode verifikasi OTP akan dikirimkan ke email ini"
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
                    placeholder="Minimal 6 karakter"
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

                  <TextField
                    label="Konfirmasi Kata Sandi"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon color="action" fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        Saya menyetujui{" "}
                        <Link
                          href="#"
                          style={{ color: "#0E639C", textDecoration: "none" }}
                        >
                          Syarat & Ketentuan
                        </Link>{" "}
                        serta{" "}
                        <Link
                          href="#"
                          style={{ color: "#0E639C", textDecoration: "none" }}
                        >
                          Kebijakan Privasi
                        </Link>
                      </Typography>
                    }
                  />

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
                      "Daftar & Kirim Kode Verifikasi"
                    )}
                  </Button>
                </Stack>
              </Box>

              <Divider sx={{ my: 3.5 }}>
                <Typography variant="caption" color="text.secondary">
                  SUDAH PUNYA AKUN?
                </Typography>
              </Divider>

              <Stack direction="row" justifyContent="center" spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Sudah terdaftar?
                </Typography>
                <Typography
                  component={Link}
                  href="/login"
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" }
                  }}
                >
                  Masuk di sini
                </Typography>
              </Stack>
            </>
          ) : (
            /* STEP 2: VERIFIKASI OTP 6 DIGIT */
            <>
              <Stack
                alignItems="center"
                spacing={1.5}
                sx={{ mb: 3.5, textAlign: "center" }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 0.5
                  }}
                >
                  <MarkEmailReadOutlinedIcon sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Verifikasi Alamat Email
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: 360 }}
                >
                  Kami telah mengirimkan 6-digit kode verifikasi ke alamat
                  email:
                </Typography>
                <Chip
                  label={email}
                  color="primary"
                  variant="outlined"
                  onDelete={() => setStep(1)}
                  deleteIcon={<EditOutlinedIcon />}
                  sx={{ fontWeight: 600, fontSize: 13, mt: 0.5 }}
                />
              </Stack>

              {errorMsg && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                  {errorMsg}
                </Alert>
              )}

              {successMsg && (
                <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
                  {successMsg}
                </Alert>
              )}

              <Box component="form" onSubmit={handleVerifyOtp} noValidate>
                {/* 6 Digit Input Boxes */}
                <Stack
                  direction="row"
                  spacing={{ xs: 1, sm: 1.5 }}
                  justifyContent="center"
                  sx={{ my: 3 }}
                >
                  {otp.map((digit, idx) => (
                    <Box
                      key={idx}
                      component="input"
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      ref={(el: HTMLInputElement | null) => {
                        otpInputsRef.current[idx] = el
                      }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleOtpChange(idx, e.target.value)
                      }
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        handleKeyDown(idx, e)
                      }
                      onPaste={handlePaste}
                      sx={{
                        width: { xs: 44, sm: 54 },
                        height: { xs: 52, sm: 62 },
                        fontSize: { xs: 22, sm: 26 },
                        fontWeight: 700,
                        textAlign: "center",
                        borderRadius: 2,
                        border: "2px solid",
                        borderColor: digit ? "primary.main" : "#CBD5E1",
                        bgcolor: digit ? "#F0F9FF" : "#FFF",
                        outline: "none",
                        transition: "all 0.2s ease",
                        "&:focus": {
                          borderColor: "primary.main",
                          boxShadow: "0 0 0 3px rgba(14, 99, 156, 0.2)"
                        }
                      }}
                    />
                  ))}
                </Stack>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading || otp.join("").length !== 6}
                  sx={{
                    py: 1.4,
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 2,
                    mb: 2.5
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Verifikasi & Aktifkan Akun"
                  )}
                </Button>

                {/* Resend OTP Section */}
                <Stack alignItems="center" spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Tidak menerima kode verifikasi?
                  </Typography>
                  <Button
                    variant="text"
                    disabled={!canResend || loading}
                    onClick={handleResendCode}
                    startIcon={<RefreshOutlinedIcon />}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    {canResend
                      ? "Kirim Ulang Kode OTP"
                      : `Kirim Ulang dalam ${timer}s`}
                  </Button>

                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setStep(1)}
                    sx={{
                      color: "text.secondary",
                      textTransform: "none",
                      mt: 1
                    }}
                  >
                    ← Ubah Data Pendaftaran
                  </Button>
                </Stack>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  )
}
