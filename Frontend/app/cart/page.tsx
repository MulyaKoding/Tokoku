"use client"

import Navbar from "@/app/components/layout/Navbar"
import Footer from "@/app/components/layout/Footer"
import { useCart } from "@/app/context/CartContext"
import { formatRupiah } from "@/app/lib/products"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Button,
  IconButton,
  Divider,
  Paper
} from "@mui/material"
import Link from "next/link"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart()

  if (cartItems.length === 0) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
          <ShoppingCartOutlinedIcon
            sx={{ fontSize: 56, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
            Keranjang kamu kosong
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Yuk mulai jelajahi produk pilihan TokoKu.
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
          Keranjang Belanja
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Stack gap={2}>
              {cartItems.map((item) => (
                <Paper
                  key={item.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    display: "flex",
                    gap: 2,
                    alignItems: "center"
                  }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      objectFit: "cover",
                      flexShrink: 0
                    }}
                  />
                  <Stack sx={{ flexGrow: 1, minWidth: 0 }} gap={0.5}>
                    <Typography sx={{ fontWeight: 600, fontSize: 15 }} noWrap>
                      {item.name}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                      {item.category}
                    </Typography>
                    <Typography sx={{ color: "primary.main", fontWeight: 700 }}>
                      {formatRupiah(item.price)}
                    </Typography>
                  </Stack>

                  <Stack alignItems="flex-end" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => removeFromCart(item.id)}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteOutlineOutlinedIcon sx={{ fontSize: 20 }} />
                    </IconButton>
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
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <RemoveOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Typography
                        sx={{
                          px: 1.5,
                          minWidth: 24,
                          textAlign: "center",
                          fontSize: 14
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <AddOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Grid>

          {/* Ringkasan */}
          <Grid item xs={12} md={4}>
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
                Ringkasan Belanja
              </Typography>
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
                <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography
                  sx={{ fontWeight: 700, color: "primary.main", fontSize: 18 }}
                >
                  {formatRupiah(totalPrice)}
                </Typography>
              </Stack>
              <Button
                component={Link}
                href="/checkout"
                variant="contained"
                fullWidth
                size="large"
              >
                Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}
