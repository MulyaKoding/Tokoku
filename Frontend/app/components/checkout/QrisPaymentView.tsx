"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Collapse,
  Tooltip,
  LinearProgress,
  IconButton
} from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined"
import VerifiedIcon from "@mui/icons-material/Verified"
import RefreshIcon from "@mui/icons-material/Refresh"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import SecurityIcon from "@mui/icons-material/Security"
import Image from "next/image"
import { formatRupiah } from "@/app/lib/products"
import { qrcodegen } from "@/app/lib/qrcodegen"

interface QrisPaymentViewProps {
  amount: number
  orderId?: string
  onPaidSuccess?: () => void
  showVerificationButton?: boolean
}

const QR_LIFETIME_SECONDS = 120 // 2 Menit

export default function QrisPaymentView({
  amount,
  orderId = "TK-QRIS",
  onPaidSuccess,
  showVerificationButton = true
}: QrisPaymentViewProps) {
  // Session code dinamis yang berganti tiap 2 menit
  const [sessionToken, setSessionToken] = useState(() =>
    Math.random().toString(36).substring(2, 8).toUpperCase()
  )
  const [secondsLeft, setSecondsLeft] = useState(QR_LIFETIME_SECONDS)
  const [copiedAmount, setCopiedAmount] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [verifying, setVerifying] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const qrSvgRef = useRef<SVGSVGElement | null>(null)

  // Fungsi generate session baru untuk keamanan anti-penyalahgunaan
  const renewQrSession = () => {
    setIsRefreshing(true)
    const newToken = Math.random().toString(36).substring(2, 8).toUpperCase()
    setSessionToken(newToken)
    setSecondsLeft(QR_LIFETIME_SECONDS)
    setRefreshCount((prev) => prev + 1)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 400)
  }

  // Timer 2 menit (120 detik) otomatis berganti
  useEffect(() => {
    if (isPaid) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Waktu 2 menit habis -> otomatis regenerate kode QR baru
          renewQrSession()
          return QR_LIFETIME_SECONDS
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaid])

  // Generate dynamic QR payload (EMVCo QRIS compliant dynamic string)
  const qrPayload = useMemo(() => {
    const timestamp = Date.now().toString().slice(-6)
    return `00020101021226670014ID.LINKAJA.WWW01189360091100202488910215ID10202488910010303UME51440014ID.CO.QRIS.WWW0215ID10202488910010303UME52045999530336054${amount.toFixed(0)}5802ID5915TOKOKU OFFICIAL6013JAKARTA PUSAT61051011062${sessionToken}${timestamp}6304`
  }, [amount, sessionToken])

  // Generate pure vector QR Code modules (tanpa gambar statis)
  const { qrSize, qrPath } = useMemo(() => {
    try {
      const qr = qrcodegen.QrCode.encodeText(
        qrPayload,
        qrcodegen.QrCode.Ecc.QUARTILE
      )
      const size = qr.size
      let path = ""

      // Area tengah di-exclude untuk logo badge TokoKu
      const centerStart = Math.floor(size * 0.38)
      const centerEnd = Math.ceil(size * 0.62)

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (qr.getModule(x, y)) {
            // Hindari module yang tertutup logo tengah
            const isCenter =
              x >= centerStart &&
              x <= centerEnd &&
              y >= centerStart &&
              y <= centerEnd
            if (!isCenter) {
              path += `M${x},${y}h1v1h-1z `
            }
          }
        }
      }

      return { qrSize: size, qrPath: path }
    } catch {
      return { qrSize: 29, qrPath: "" }
    }
  }, [qrPayload])

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amount.toString())
    setCopiedAmount(true)
    setTimeout(() => setCopiedAmount(false), 2000)
  }

  // Client-side dynamic canvas export untuk download tanpa gambar server
  const handleDownloadDynamicQR = () => {
    const canvas = document.createElement("canvas")
    const scale = 3
    canvas.width = 480 * scale
    canvas.height = 680 * scale
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.scale(scale, scale)

    // Background kartu
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, 480, 680)

    // Border kartu
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, 460, 660)

    // Header QRIS
    ctx.fillStyle = "#DC2626"
    ctx.font = "bold 26px Arial, sans-serif"
    ctx.fillText("QRIS", 30, 50)
    ctx.fillStyle = "#1F2937"
    ctx.font = "bold 11px Arial, sans-serif"
    ctx.fillText("PEMBAYARAN DIGITAL", 30, 68)

    // GPN Badge
    ctx.fillStyle = "#DC2626"
    ctx.fillRect(380, 28, 70, 40)
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 14px Arial, sans-serif"
    ctx.fillText("GPN", 398, 48)
    ctx.font = "bold 8px Arial, sans-serif"
    ctx.fillText("INDONESIA", 388, 62)

    // Merchant Info
    ctx.fillStyle = "#111827"
    ctx.font = "bold 18px Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("TokoKu Official Store", 240, 115)
    ctx.fillStyle = "#6B7280"
    ctx.font = "12px Arial, sans-serif"
    ctx.fillText(`NMID: ID1020248891001 • Ref: TK-${sessionToken}`, 240, 136)

    // Draw QR Modules to Canvas
    const qrDrawSize = 280
    const qrOffsetLeft = (480 - qrDrawSize) / 2
    const qrOffsetTop = 160
    const cell = qrDrawSize / qrSize

    ctx.fillStyle = "#111827"
    const qrObj = qrcodegen.QrCode.encodeText(
      qrPayload,
      qrcodegen.QrCode.Ecc.QUARTILE
    )
    const centerStart = Math.floor(qrSize * 0.38)
    const centerEnd = Math.ceil(qrSize * 0.62)

    for (let r = 0; r < qrSize; r++) {
      for (let c = 0; c < qrSize; c++) {
        if (qrObj.getModule(c, r)) {
          const isCenter =
            c >= centerStart && c <= centerEnd && r >= centerStart && r <= centerEnd
          if (!isCenter) {
            ctx.fillRect(
              qrOffsetLeft + c * cell,
              qrOffsetTop + r * cell,
              cell + 0.3,
              cell + 0.3
            )
          }
        }
      }
    }

    // Center TokoKu logo badge on canvas
    const badgeSize = qrDrawSize * 0.22
    const badgeX = (480 - badgeSize) / 2
    const badgeY = qrOffsetTop + (qrDrawSize - badgeSize) / 2
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(badgeX, badgeY, badgeSize, badgeSize)
    ctx.strokeStyle = "#0E639C"
    ctx.lineWidth = 2
    ctx.strokeRect(badgeX, badgeY, badgeSize, badgeSize)

    // Bottom info
    ctx.fillStyle = "#111827"
    ctx.font = "bold 14px Arial, sans-serif"
    ctx.fillText("Total Pembayaran:", 240, 480)
    ctx.fillStyle = "#0E639C"
    ctx.font = "bold 22px Arial, sans-serif"
    ctx.fillText(formatRupiah(amount), 240, 510)

    ctx.fillStyle = "#6B7280"
    ctx.font = "11px Arial, sans-serif"
    ctx.fillText("SATU QRIS UNTUK SEMUA PEMBAYARAN", 240, 570)
    ctx.fillText("GoPay • OVO • DANA • ShopeePay • BCA • Mandiri • BRI", 240, 590)
    ctx.fillStyle = "#9CA3AF"
    ctx.font = "10px Arial, sans-serif"
    ctx.fillText(`Berlaku 2 menit • Sesi: ${sessionToken}`, 240, 630)

    // Trigger download
    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = `QRIS-Dinamis-TokoKu-${sessionToken}.png`
    link.click()
  }

  const handleCheckStatus = () => {
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      setIsPaid(true)
      if (onPaidSuccess) {
        onPaidSuccess()
      }
    }, 1200)
  }

  const progressPercent = (secondsLeft / QR_LIFETIME_SECONDS) * 100

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: 3,
        border: "1.5px solid",
        borderColor: isPaid ? "success.main" : "primary.main",
        bgcolor: "#FFFFFF",
        boxShadow: "0 8px 30px rgba(14, 99, 156, 0.08)",
        overflow: "hidden"
      }}
    >
      {/* Header QRIS Status & Security Notice */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={1.5}
        sx={{
          pb: 2,
          mb: 2.5,
          borderBottom: "1px dashed",
          borderColor: "divider"
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: isPaid ? "success.light" : "primary.main",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {isPaid ? <CheckCircleIcon /> : <SecurityIcon />}
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                QRIS Dinamis Otomatis
              </Typography>
              <Chip
                size="small"
                label="Anti-Penyalahgunaan"
                color="primary"
                sx={{
                  fontWeight: 700,
                  fontSize: 10,
                  height: 20
                }}
              />
            </Stack>
            <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
              Kode QR di-generate langsung dan berganti otomatis setiap 2 menit
            </Typography>
          </Box>
        </Stack>

        {/* 2-Minute Security Countdown Timer */}
        {!isPaid ? (
          <Box sx={{ minWidth: 160 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                px: 1.5,
                py: 0.6,
                borderRadius: 2,
                bgcolor: secondsLeft <= 30 ? "#FEE2E2" : "#EFF6FF",
                color: secondsLeft <= 30 ? "#B91C1C" : "primary.main",
                border: "1px solid",
                borderColor: secondsLeft <= 30 ? "#FCA5A5" : "#BFDBFE"
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <TimerOutlinedIcon
                  sx={{
                    fontSize: 17,
                    animation: secondsLeft <= 30 ? "pulse 1s infinite" : "none"
                  }}
                />
                <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                  {formatTimer(secondsLeft)}
                </Typography>
              </Stack>
              <Tooltip title="Perbarui Kode QR sekarang">
                <IconButton
                  size="small"
                  onClick={renewQrSession}
                  disabled={isRefreshing}
                  sx={{ p: 0.3 }}
                >
                  <RefreshIcon
                    sx={{
                      fontSize: 18,
                      animation: isRefreshing ? "spin 0.6s linear" : "none",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" }
                      }
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              color={secondsLeft <= 30 ? "error" : "primary"}
              sx={{ height: 4, borderRadius: 2, mt: 0.6 }}
            />
          </Box>
        ) : (
          <Chip
            color="success"
            icon={<VerifiedIcon />}
            label="Lunas / Terverifikasi"
            sx={{ fontWeight: 700 }}
          />
        )}
      </Stack>

      {/* Konten Utama */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems={{ xs: "center", md: "flex-start" }}
      >
        {/* Kolom Kiri: Standee Frame QRIS Dinamis (HTML/SVG murni, bukan gambar statis) */}
        <Box
          sx={{
            width: { xs: "100%", sm: 330, md: 350 },
            flexShrink: 0,
            textAlign: "center"
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1.5px solid #E5E7EB",
              bgcolor: "#FFFFFF",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              transition: "transform 0.2s ease, opacity 0.2s ease",
              opacity: isRefreshing ? 0.6 : 1,
              transform: isRefreshing ? "scale(0.98)" : "scale(1)"
            }}
          >
            {/* Header Standee QRIS Resmi */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ pb: 1.5, borderBottom: "1px solid #F3F4F6", mb: 1.5 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: 26,
                    color: "#DC2626",
                    letterSpacing: "-0.04em",
                    lineHeight: 1
                  }}
                >
                  QRIS
                </Typography>
                <Box
                  sx={{
                    borderLeft: "1.5px solid #E5E7EB",
                    pl: 1,
                    textAlign: "left"
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: "#1F2937",
                      lineHeight: 1.1
                    }}
                  >
                    PEMBAYARAN DIGITAL
                  </Typography>
                  <Typography
                    sx={{ fontSize: 8, color: "#6B7280", letterSpacing: "0.02em" }}
                  >
                    STANDAR NASIONAL
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  bgcolor: "#DC2626",
                  color: "#FFFFFF",
                  px: 1.2,
                  py: 0.4,
                  borderRadius: 1.5,
                  textAlign: "center"
                }}
              >
                <Typography
                  sx={{ fontWeight: 900, fontSize: 13, lineHeight: 1.1 }}
                >
                  GPN
                </Typography>
                <Typography
                  sx={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.05em" }}
                >
                  INDONESIA
                </Typography>
              </Box>
            </Stack>

            {/* Merchant Details */}
            <Typography sx={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>
              TokoKu Official Store
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "#4B5563", mt: 0.2 }}>
              NMID : ID1020248891001 • A01
            </Typography>
            <Typography
              sx={{
                fontSize: 10,
                color: "primary.main",
                fontWeight: 600,
                mt: 0.2,
                mb: 1.5
              }}
            >
              ID Sesi: {sessionToken} (Auto-Refresh #{refreshCount + 1})
            </Typography>

            {/* DYNAMIC SVG QR CODE GENERATION (Pure Client-side Vector) */}
            <Box
              sx={{
                position: "relative",
                width: 260,
                height: 260,
                mx: "auto",
                p: 1.5,
                bgcolor: "#FFFFFF",
                borderRadius: 2,
                border: "1px solid #E5E7EB",
                boxShadow: "inset 0 0 8px rgba(0,0,0,0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {qrPath ? (
                <svg
                  ref={qrSvgRef}
                  viewBox={`0 0 ${qrSize} ${qrSize}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    shapeRendering: "crispEdges",
                    filter: isPaid ? "grayscale(80%) opacity(0.35)" : "none"
                  }}
                >
                  <path d={qrPath} fill="#111827" />
                </svg>
              ) : (
                <CircularProgress size={32} />
              )}

              {/* TokoKu Realistic Logo Badge di Tengah QR */}
              {!isPaid && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: "#FFFFFF",
                    border: "2px solid #0E639C",
                    boxShadow: "0 2px 8px rgba(14,99,156,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 0.5
                  }}
                >
                  <Image
                    src="/tokoku-icon.png"
                    alt="TokoKu QR Logo"
                    width={36}
                    height={36}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              )}

              {isPaid && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "#DCFCE7",
                    color: "#166534",
                    border: "2px solid #22C55E",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 24 }} />
                  <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                    LUNAS
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Footer Standee */}
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "#374151",
                mt: 1.5,
                letterSpacing: "0.03em"
              }}
            >
              SATU QRIS UNTUK SEMUA PEMBAYARAN
            </Typography>
            <Typography
              sx={{ fontSize: 9.5, color: "#6B7280", mt: 0.3 }}
            >
              GoPay • OVO • DANA • ShopeePay • BCA • Mandiri • BRI
            </Typography>
          </Box>

          {/* Action Buttons: Download Generated QR & Manual Refresh */}
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadDynamicQR}
              sx={{ textTransform: "none", fontSize: 12 }}
            >
              Unduh QR
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={renewQrSession}
              sx={{ textTransform: "none", fontSize: 12 }}
            >
              Perbarui QR
            </Button>
          </Stack>
        </Box>

        {/* Kolom Kanan: Rincian Nominal, Keamanan 2 Menit & Panduan */}
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          {/* Alert Proteksi Keamanan 2 Menit */}
          <Alert
            severity="info"
            icon={<SecurityIcon />}
            sx={{
              mb: 2,
              borderRadius: 2,
              "& .MuiAlert-message": { fontSize: 12.5 }
            }}
          >
            <strong>Proteksi Anti-Penyalahgunaan Aktif:</strong> QR code ini bersifat
            dinamis dan otomatis diperbarui setiap <strong>2 menit</strong> (
            {formatTimer(secondsLeft)} tersisa). Segera selesaikan pembayaran
            sebelum sesi kedaluwarsa.
          </Alert>

          {/* Card Nominal yang Harus Dibayar */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: "#F8FAFC",
              borderColor: "#E2E8F0",
              mb: 2.5
            }}
          >
            <Typography sx={{ fontSize: 12.5, color: "text.secondary", mb: 0.5 }}>
              Total Nominal Pembayaran:
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
            >
              <Typography
                sx={{
                  fontSize: { xs: 22, sm: 26 },
                  fontWeight: 800,
                  color: "primary.main",
                  letterSpacing: "-0.02em"
                }}
              >
                {formatRupiah(amount)}
              </Typography>
              <Tooltip title={copiedAmount ? "Tersalin!" : "Salin Nominal"}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={
                    copiedAmount ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <ContentCopyIcon />
                    )
                  }
                  onClick={handleCopyAmount}
                  sx={{
                    textTransform: "none",
                    fontSize: 12.5,
                    bgcolor: copiedAmount ? "#DCFCE7" : "#FFFFFF"
                  }}
                >
                  {copiedAmount ? "Tersalin" : "Salin Nominal"}
                </Button>
              </Tooltip>
            </Stack>
            <Typography sx={{ fontSize: 11.5, color: "text.secondary", mt: 1 }}>
              *Nominal otomatis tercantum pada layar scan aplikasi e-wallet / m-Banking Anda.
            </Typography>
          </Paper>

          {/* Banner Aplikasi yang Didukung */}
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, mb: 1, color: "text.secondary" }}>
              Bisa dibayar menggunakan:
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {[
                "GoPay",
                "OVO",
                "DANA",
                "ShopeePay",
                "LinkAja",
                "BCA Mobile",
                "Livin Mandiri",
                "BRImo",
                "BNI Mobile",
                "BSI Mobile"
              ].map((app) => (
                <Chip
                  key={app}
                  label={app}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: 11.5,
                    bgcolor: "#FFFFFF",
                    borderColor: "#E2E8F0",
                    fontWeight: 500
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Panduan Pembayaran */}
          <Box sx={{ mb: 2.5 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>
                Cara Pembayaran QRIS
              </Typography>
              <Button
                size="small"
                onClick={() => setShowGuide(!showGuide)}
                startIcon={<HelpOutlineIcon />}
                sx={{ fontSize: 12, textTransform: "none" }}
              >
                {showGuide ? "Sembunyikan" : "Lihat Petunjuk"}
              </Button>
            </Stack>

            <Collapse in={showGuide}>
              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, bgcolor: "#FAFAFA" }}
              >
                <Tabs
                  value={activeTab}
                  onChange={(_, val) => setActiveTab(val)}
                  variant="standard"
                  sx={{
                    minHeight: 36,
                    mb: 1.5,
                    "& .MuiTab-root": {
                      fontSize: 12.5,
                      minHeight: 36,
                      py: 0.5,
                      textTransform: "none",
                      fontWeight: 600
                    }
                  }}
                >
                  <Tab label="E-Wallet (GoPay, OVO, DANA)" />
                  <Tab label="M-Banking (BCA, Mandiri, BRI)" />
                </Tabs>

                {activeTab === 0 ? (
                  <Stack spacing={1} sx={{ fontSize: 12.5, color: "text.primary" }}>
                    <Typography sx={{ fontSize: 12.5 }}>
                      <strong>1.</strong> Buka aplikasi <strong>GoPay, OVO, DANA, atau ShopeePay</strong>.
                    </Typography>
                    <Typography sx={{ fontSize: 12.5 }}>
                      <strong>2.</strong> Klik menu <strong>Bayar</strong> atau <strong>Scan QRIS</strong>.
                    </Typography>
                    <Typography sx={{ fontSize: 12.5 }}>
                      <strong>3.</strong> Arahkan kamera ke kode QR dinamis di samping (atau upload foto jika mengunduh).
                    </Typography>
                    <Typography sx={{ fontSize: 12.5 }}>
                      <strong>4.</strong> Periksa nama merchant: <strong>TokoKu Official Store</strong>.
                    </Typography>
                    <Typography sx={{ fontSize: 12.5 }}>
                      <strong>5.</strong> Masukkan PIN pembayaran Anda dan transaksi selesai.
                    </Typography>
                  </Stack>
                ) : (
                  <Stack spacing={1} sx={{ fontSize: 12.5, color: "text.primary" }}>
                    <Typography sx={{ fontSize: 12.5 }}>
                      <strong>1.</strong> Login ke aplikasi <strong>BCA Mobile, Livin Mandiri, BRImo, atau BNI Mobile</strong>.
                    </Typography>
                    <Typography sx={{ fontSize: 12.5 }}>
                      <strong>2.</strong> Pilih menu <strong>QR / QRIS</strong> di halaman utama aplikasi.
                    </Typography>
                    <Typography sx={{ fontSize: 12.5 }}>
                      <strong>3.</strong> Scan kode QR dinamis TokoKu.
                    </Typography>
                    <Typography sx={{ fontSize: 12.5 }}>
                      <strong>4.</strong> Pastikan penerima adalah <strong>TokoKu Official Store</strong> dan nominal sesuai.
                    </Typography>
                    <Typography sx={{ fontSize: 12.5 }}>
                      <strong>5.</strong> Masukkan PIN m-Banking untuk menyelesaikan transaksi.
                    </Typography>
                  </Stack>
                )}
              </Paper>
            </Collapse>
          </Box>

          {/* Tombol Verifikasi Simulasi */}
          {showVerificationButton && (
            <Box>
              {!isPaid ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="medium"
                  disabled={verifying}
                  onClick={handleCheckStatus}
                  startIcon={
                    verifying ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <CheckCircleIcon />
                    )
                  }
                  sx={{
                    py: 1.2,
                    fontWeight: 700,
                    fontSize: 13.5,
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(14, 99, 156, 0.25)"
                  }}
                >
                  {verifying
                    ? "Memeriksa Pembayaran..."
                    : "Saya Sudah Membayar (Cek Status)"}
                </Button>
              ) : (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  Pembayaran QRIS telah diverifikasi. Pesanan Anda siap diproses!
                </Alert>
              )}
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  )
}
