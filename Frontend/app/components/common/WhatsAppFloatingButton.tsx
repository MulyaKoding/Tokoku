"use client"

import { useEffect, useState } from "react"
import { Box, Fab, Typography, IconButton, Fade } from "@mui/material"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import CloseIcon from "@mui/icons-material/Close"

const WHATSAPP_NUMBER = "6285218789439" // ganti dengan nomor kamu (format 62xxx, tanpa +)
const WHATSAPP_MESSAGE = "Halo TokoKu, saya mau tanya-tanya produk"

export default function WhatsAppFloatingButton() {
  const [showBubble, setShowBubble] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setShowBubble(true), 1500)
    return () => clearTimeout(showTimer)
  }, [])

  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      WHATSAPP_MESSAGE
    )}`
    window.open(url, "_blank")
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 20, md: 32 },
        right: { xs: 20, md: 32 },
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 1.5
      }}
    >
      {/* Bubble notifikasi */}
      <Fade in={showBubble} timeout={500}>
        <Box
          sx={{
            position: "relative",
            bgcolor: "#FFFFFF",
            borderRadius: 3,
            boxShadow: "0 8px 24px -8px rgba(10,36,34,0.25)",
            px: 2.5,
            py: 1.5,
            maxWidth: 220,
            display: showBubble ? "block" : "none"
          }}
        >
          <IconButton
            size="small"
            onClick={() => setShowBubble(false)}
            sx={{
              position: "absolute",
              top: -8,
              right: -8,
              bgcolor: "grey.200",
              width: 20,
              height: 20,
              "&:hover": { bgcolor: "grey.300" }
            }}
          >
            <CloseIcon sx={{ fontSize: 12 }} />
          </IconButton>
          <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>
            Butuh bantuan?
          </Typography>
          <Typography
            sx={{ fontSize: 12.5, color: "text.secondary", lineHeight: 1.4 }}
          >
            Chat tim TokoKu sekarang
          </Typography>
        </Box>
      </Fade>

      {/* Tombol dengan animasi pulse */}
      <Box sx={{ position: "relative", width: 56, height: 56 }}>
        {/* Ring pulse 1 */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            bgcolor: "#25D366",
            animation: "waPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            "@keyframes waPulse": {
              "0%": { transform: "scale(1)", opacity: 0.6 },
              "100%": { transform: "scale(1.9)", opacity: 0 }
            }
          }}
        />
        {/* Ring pulse 2 (delay) */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            bgcolor: "#25D366",
            animation: "waPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            animationDelay: "0.5s",
            "@keyframes waPulse": {
              "0%": { transform: "scale(1)", opacity: 0.6 },
              "100%": { transform: "scale(1.9)", opacity: 0 }
            }
          }}
        />

        <Fab
          onClick={handleClick}
          aria-label="Hubungi kami via WhatsApp"
          sx={{
            position: "relative",
            width: 56,
            height: 56,
            bgcolor: "#25D366",
            color: "#FFFFFF",
            boxShadow: "0 8px 20px -6px rgba(37, 211, 102, 0.6)",
            "&:hover": {
              bgcolor: "#1EBE57",
              transform: "scale(1.06)"
            },
            transition: "transform 0.2s ease"
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 28 }} />
        </Fab>
      </Box>
    </Box>
  )
}
