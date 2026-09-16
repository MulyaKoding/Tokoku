"use client"

import Navbar from "@/app/components/layout/Navbar"
import Footer from "@/app/components/layout/Footer"
import { useCart } from "@/app/context/CartContext"
import { getProductById, PRODUCTS, formatRupiah } from "@/app/lib/products"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined"
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import StarRoundedIcon from "@mui/icons-material/StarRounded"
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Button,
  IconButton,
  Chip,
  Divider,
  Snackbar,
  Alert
} from "@mui/material"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()

  const product = getProductById(params?.id as string | undefined)
  const [quantity, setQuantity] = useState(1)
  const [snackOpen, setSnackOpen] = useState(false)

  if (!product) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Produk tidak ditemukan
          </Typography>
          <Button component={Link} href="/products" variant="contained">
            Kembali ke Produk
          </Button>
        </Container>
        <Footer />
      </Box>
    )
  }

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setSnackOpen(true)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    router.push("/checkout")
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Button
          component={Link}
          href="/products"
          startIcon={<ArrowBackOutlinedIcon />}
          sx={{ mb: 3, color: "text.secondary" }}
        >
          Kembali
        </Button>

        <Grid container spacing={5}>
          {/* Gambar produk */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                aspectRatio: "1 / 1",
                bgcolor: "background.paper"
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Grid>

          {/* Info produk */}
          <Grid item xs={12} md={6}>
            <Stack gap={2}>
              <Chip
                label={product.category}
                size="small"
                sx={{ alignSelf: "flex-start", fontWeight: 600 }}
              />
              <Typography
                variant="h4"
                sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700 }}
              >
                {product.name}
              </Typography>

              <Stack direction="row" alignItems="center" gap={0.5}>
                <StarRoundedIcon sx={{ color: "#F5A623", fontSize: 20 }} />
                <Typography sx={{ fontWeight: 600 }}>
                  {product.rating}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                  · Stok {product.stock}
                </Typography>
              </Stack>

              <Typography
                variant="h5"
                sx={{ color: "primary.main", fontWeight: 700, fontSize: 28 }}
              >
                {formatRupiah(product.price)}
              </Typography>

              <Divider />

              <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                {product.description}
              </Typography>

              <Divider />

              {/* Quantity selector */}
              <Stack direction="row" alignItems="center" gap={2}>
                <Typography sx={{ fontWeight: 600 }}>Jumlah</Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <RemoveOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Typography sx={{ px: 2, minWidth: 32, textAlign: "center" }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                  >
                    <AddOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </Stack>

              {/* Tombol aksi */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                gap={2}
                sx={{ mt: 1 }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<ShoppingCartOutlinedIcon />}
                  onClick={handleAddToCart}
                >
                  Tambah ke Keranjang
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleBuyNow}
                >
                  Beli Sekarang
                </Button>
              </Stack>

              <Stack direction="row" gap={3} sx={{ mt: 2 }}>
                <Stack direction="row" gap={1} alignItems="center">
                  <VerifiedOutlinedIcon
                    sx={{ fontSize: 20, color: "primary.main" }}
                  />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Garansi resmi 1 tahun
                  </Typography>
                </Stack>
                <Stack direction="row" gap={1} alignItems="center">
                  <LocalShippingOutlinedIcon
                    sx={{ fontSize: 20, color: "primary.main" }}
                  />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Gratis ongkir
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* Produk terkait */}
        {related.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Produk Serupa
            </Typography>
            <Grid container spacing={3}>
              {related.map((p) => (
                <Grid item xs={6} sm={3} key={p.id}>
                  <Box
                    component={Link}
                    href={`/products/${p.id}`}
                    sx={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                      borderRadius: 3,
                      overflow: "hidden",
                      bgcolor: "background.paper",
                      transition: "transform 0.2s ease",
                      "&:hover": { transform: "translateY(-4px)" }
                    }}
                  >
                    <Box
                      component="img"
                      src={p.image}
                      alt={p.name}
                      sx={{
                        width: "100%",
                        aspectRatio: "1/1",
                        objectFit: "cover"
                      }}
                    />
                    <Box sx={{ p: 1.5 }}>
                      <Typography
                        sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}
                      >
                        {p.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "primary.main",
                          fontWeight: 700
                        }}
                      >
                        {formatRupiah(p.price)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {product.name} ditambahkan ke keranjang
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  )
}
