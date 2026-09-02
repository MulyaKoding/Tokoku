"use client"

import Navbar from "@/app/components/layout/Navbar"
import Footer from "@/app/components/layout/Footer"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Paper,
  Divider,
  CircularProgress
} from "@mui/material"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const paymentLabels: Record<string, string> = {
  bank_transfer: "Transfer Bank",
  qris: "QRIS",
  ewallet: "E-Wallet",
  credit_card: "Kartu Kredit / Debit",
  cod: "Bayar di Tempat (COD)"
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId") || "-"
  const payment = searchParams.get("payment") || ""

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, textAlign: "center" }}
    >
      <CheckCircleOutlineIcon
        sx={{ fontSize: 64, color: "success.main", mb: 2 }}
      />
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Pesanan Berhasil Dibuat!
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        Terima kasih sudah berbelanja di TokoKu. Kami akan segera memproses
        pesananmu.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Stack gap={1.5} sx={{ textAlign: "left", mb: 4 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ color: "text.secondary" }}>
            ID Pesanan
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>{orderId}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ color: "text.secondary" }}>
            Metode Pembayaran
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>
            {paymentLabels[payment] || "-"}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <Button
          component={Link}
          href="/products"
          variant="outlined"
          fullWidth
          size="large"
        >
          Belanja Lagi
        </Button>
        <Button
          component={Link}
          href="/"
          variant="contained"
          fullWidth
          size="large"
        >
          Kembali ke Beranda
        </Button>
      </Stack>
    </Paper>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 } }}>
        <Suspense
          fallback={
            <Box sx={{ textAlign: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          }
        >
          <SuccessContent />
        </Suspense>
      </Container>
      <Footer />
    </Box>
  )
}
