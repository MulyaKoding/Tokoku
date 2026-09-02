"use client"

import Navbar from "@/app/components/layout/Navbar"
import Footer from "@/app/components/layout/Footer"
import { useCart } from "@/app/context/CartContext"
import { formatRupiah } from "@/app/lib/products"
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined"
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined"
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined"
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined"
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined"
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Button,
  TextField,
  Paper,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const paymentMethods = [
  {
    value: "bank_transfer",
    label: "Transfer Bank",
    desc: "BCA, BNI, BRI, Mandiri (Virtual Account)",
    icon: <AccountBalanceOutlinedIcon />
  },
  {
    value: "qris",
    label: "QRIS",
    desc: "Bayar dengan scan QR dari e-wallet atau m-banking",
    icon: <QrCode2OutlinedIcon />
  },
  {
    value: "ewallet",
    label: "E-Wallet",
    desc: "GoPay, OVO, DANA, ShopeePay",
    icon: <AccountBalanceWalletOutlinedIcon />
  },
  {
    value: "credit_card",
    label: "Kartu Kredit / Debit",
    desc: "Visa, Mastercard, JCB",
    icon: <CreditCardOutlinedIcon />
  },
  {
    value: "cod",
    label: "Bayar di Tempat (COD)",
    desc: "Bayar tunai saat barang sampai",
    icon: <LocalShippingOutlinedIcon />
  }
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, totalPrice, clearCart } = useCart()

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: ""
  })
  const [payment, setPayment] = useState("bank_transfer")
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: false }))
  }

  const handleSubmit = () => {
    const requiredFields = ["name", "phone", "address", "city", "postalCode"]
    const newErrors: Record<string, boolean> = {}
    requiredFields.forEach((field) => {
      if (!form[field as keyof typeof form].trim()) newErrors[field] = true
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    const orderId = `TK${Date.now().toString().slice(-8)}`

    setTimeout(() => {
      clearCart()
      router.push(`/checkout/success?orderId=${orderId}&payment=${payment}`)
    }, 800)
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
            Keranjang kamu kosong
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Tambahkan produk terlebih dahulu sebelum checkout.
          </Typography>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            size="large"
          >
            Lihat Produk
          </Button>
        </Container>
        <Footer />
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: 700, fontSize: { xs: 26, md: 32 } }}
        >
          Checkout
        </Typography>

        <Grid container spacing={4}>
          {/* Kiri: alamat + pembayaran */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, bgcolor: "background.paper", mb: 3 }}
            >
              <Typography sx={{ fontWeight: 700, mb: 2 }}>
                Alamat Pengiriman
              </Typography>
              <Stack gap={2}>
                <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                  <TextField
                    fullWidth
                    label="Nama Penerima"
                    value={form.name}
                    error={errors.name}
                    helperText={errors.name ? "Wajib diisi" : ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="No. HP"
                    value={form.phone}
                    error={errors.phone}
                    helperText={errors.phone ? "Wajib diisi" : ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </Stack>
                <TextField
                  fullWidth
                  label="Alamat Lengkap"
                  multiline
                  rows={3}
                  value={form.address}
                  error={errors.address}
                  helperText={errors.address ? "Wajib diisi" : ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
                <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                  <TextField
                    fullWidth
                    label="Kota"
                    value={form.city}
                    error={errors.city}
                    helperText={errors.city ? "Wajib diisi" : ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Kode Pos"
                    value={form.postalCode}
                    error={errors.postalCode}
                    helperText={errors.postalCode ? "Wajib diisi" : ""}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                  />
                </Stack>
                <TextField
                  fullWidth
                  label="Catatan (opsional)"
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, bgcolor: "background.paper" }}
            >
              <Typography sx={{ fontWeight: 700, mb: 2 }}>
                Metode Pembayaran
              </Typography>
              <RadioGroup
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <Stack gap={1.5}>
                  {paymentMethods.map((method) => (
                    <Paper
                      key={method.value}
                      variant="outlined"
                      onClick={() => setPayment(method.value)}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        cursor: "pointer",
                        borderColor:
                          payment === method.value ? "primary.main" : "divider",
                        bgcolor:
                          payment === method.value
                            ? "rgba(14,99,156,0.05)"
                            : "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                      }}
                    >
                      <Box sx={{ color: "primary.main", display: "flex" }}>
                        {method.icon}
                      </Box>
                      <FormControlLabel
                        value={method.value}
                        control={<Radio />}
                        sx={{ flexGrow: 1, m: 0 }}
                        label={
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                              {method.label}
                            </Typography>
                            <Typography
                              sx={{ fontSize: 12.5, color: "text.secondary" }}
                            >
                              {method.desc}
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  ))}
                </Stack>
              </RadioGroup>
            </Paper>
          </Grid>

          {/* Kanan: ringkasan pesanan */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "background.paper",
                position: "sticky",
                top: 90
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 2 }}>
                Ringkasan Pesanan
              </Typography>
              <Stack gap={1.5} sx={{ mb: 2 }}>
                {cartItems.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    gap={1.5}
                    alignItems="center"
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        objectFit: "cover"
                      }}
                    />
                    <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap>
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 12, color: "text.secondary" }}
                      >
                        {item.quantity} x {formatRupiah(item.price)}
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                      {formatRupiah(item.price * item.quantity)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography sx={{ color: "text.secondary" }}>
                  Subtotal
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {formatRupiah(totalPrice)}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Typography sx={{ color: "text.secondary" }}>
                  Ongkos Kirim
                </Typography>
                <Typography sx={{ fontWeight: 600, color: "success.main" }}>
                  Gratis
                </Typography>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 3 }}
              >
                <Typography sx={{ fontWeight: 700 }}>Total Bayar</Typography>
                <Typography
                  sx={{ fontWeight: 700, color: "primary.main", fontSize: 18 }}
                >
                  {formatRupiah(totalPrice)}
                </Typography>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Memproses..." : "Buat Pesanan"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}
