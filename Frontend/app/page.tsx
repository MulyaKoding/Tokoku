"use client";

import Link from "next/link";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

const highlights = [
  {
    icon: <VerifiedOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Garansi Resmi",
    desc: "Setiap produk bergaransi resmi 1 tahun langsung dari distributor.",
  },
  {
    icon: <FactCheckOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Produk Terkurasi",
    desc: "Kami seleksi setiap gadget berdasarkan kualitas, bukan sekadar tren.",
  },
  {
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Gratis Ongkir",
    desc: "Pengiriman gratis ke seluruh Indonesia untuk pembelian tertentu.",
  },
  {
    icon: <SupportAgentOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Layanan Responsif",
    desc: "Tim kami siap membantu pertanyaan produk maupun purna jual.",
  },
];

const categoryPreviews = [
  { name: "Kamera", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80" },
  { name: "Audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
  { name: "Wearable", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
  { name: "Aksesori", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80" },
];

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Navbar />

      {/* Hero */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 48 }, lineHeight: 1.1, mb: 3 }}>
              Gawai pilihan,
              <br />
              harga jujur.
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 4, maxWidth: 420 }}>
              TokoKu mengurasi kamera, audio, dan wearable dari brand tepercaya —
              tanpa markup harga yang tidak masuk akal.
            </Typography>
            <Stack direction="row" gap={2} sx={{ mb: 4 }}>
              <Button component={Link} href="/products" variant="contained" color="primary" size="large">
                Belanja Sekarang
              </Button>
              <Button component={Link} href="/#tentang" variant="outlined" color="primary" size="large">
                Tentang Kami
              </Button>
            </Stack>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Gratis ongkir se-Indonesia • Garansi resmi 1 tahun
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80"
              alt="Kamera mirrorless unggulan TokoKu"
              sx={{ width: "100%", height: { xs: 260, md: 380 }, objectFit: "cover", borderRadius: 1 }}
            />
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* Tentang / Description */}
      <Container maxWidth="lg" id="tentang" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={5}>
            <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 34 }, mb: 2 }}>
              Tentang TokoKu
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              TokoKu adalah marketplace elektronik dan gadget yang lahir dari
              keresahan sederhana: sulitnya menemukan toko online yang jujur soal
              harga dan kualitas. Kami bermitra langsung dengan distributor
              resmi, memilih setiap produk berdasarkan uji kualitas, dan
              memastikan setiap transaksi transparan dari awal sampai barang
              sampai di tangan kamu.
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Grid container spacing={3}>
              {highlights.map((item) => (
                <Grid item xs={12} sm={6} key={item.title}>
                  <Stack gap={1}>
                    <Box sx={{ color: "primary.main" }}>{item.icon}</Box>
                    <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {item.desc}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* Kategori preview */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 28 } }}>
            Jelajahi Kategori
          </Typography>
          <Typography component={Link} href="/products" variant="body2" sx={{ color: "primary.main", textDecoration: "none", fontWeight: 600 }}>
            Lihat semua produk
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          {categoryPreviews.map((cat) => (
            <Grid item xs={6} md={3} key={cat.name}>
              <Box
                component={Link}
                href={`/products?category=${cat.name}`}
                sx={{
                  position: "relative",
                  display: "block",
                  borderRadius: 1,
                  overflow: "hidden",
                  height: 160,
                  textDecoration: "none",
                }}
              >
                <Box
                  component="img"
                  src={cat.image}
                  alt={cat.name}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(10, 36, 34, 0.35)",
                    display: "flex",
                    alignItems: "flex-end",
                    p: 1.5,
                  }}
                >
                  <Typography sx={{ color: "#F5F6F3", fontWeight: 600 }}>{cat.name}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* CTA */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          gap={3}
          sx={{ bgcolor: "primary.main", color: "primary.contrastText", p: { xs: 4, md: 6 }, borderRadius: 1 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 28 }, mb: 1 }}>
              Siap upgrade gadget kamu?
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Ribuan produk elektronik pilihan menunggu di TokoKu.
            </Typography>
          </Box>
          <Button component={Link} href="/products" variant="contained" color="secondary" size="large">
            Mulai Belanja
          </Button>
        </Stack>
      </Container>

      <Footer />
    </Box>
  );
}