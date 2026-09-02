"use client"

import Footer from "@/app/components/layout/Footer"
import Navbar from "@/app/components/layout/Navbar"
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined"
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined"
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined"
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined"
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined"
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined"
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography
} from "@mui/material"
import Link from "next/link"

const stats = [
  { value: "10K+", label: "Pelanggan Puas" },
  { value: "500+", label: "Produk Terkurasi" },
  { value: "34", label: "Provinsi Terjangkau" },
  { value: "4.8/5", label: "Rating Rata-rata" }
]

const values = [
  {
    icon: <VerifiedOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Garansi Resmi",
    desc: "Setiap produk bergaransi resmi 1 tahun langsung dari distributor."
  },
  {
    icon: <FactCheckOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Produk Terkurasi",
    desc: "Kami seleksi setiap gadget berdasarkan kualitas, bukan sekadar tren."
  },
  {
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Gratis Ongkir",
    desc: "Pengiriman gratis ke seluruh Indonesia untuk pembelian tertentu."
  },
  {
    icon: <SupportAgentOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Layanan Responsif",
    desc: "Tim kami siap membantu pertanyaan produk maupun purna jual."
  }
]

const timeline = [
  {
    year: "2021",
    title: "TokoKu Didirikan",
    desc: "Berawal dari keresahan sulitnya menemukan toko gadget online yang jujur soal harga."
  },
  {
    year: "2022",
    title: "Kemitraan Distributor Resmi",
    desc: "Mulai bermitra langsung dengan distributor resmi untuk menjamin keaslian produk."
  },
  {
    year: "2023",
    title: "Ekspansi Nasional",
    desc: "Pengiriman menjangkau seluruh provinsi di Indonesia dengan gratis ongkir."
  },
  {
    year: "2024",
    title: "10.000+ Pelanggan",
    desc: "Dipercaya lebih dari sepuluh ribu pelanggan di seluruh Indonesia."
  },
  {
    year: "2025",
    title: "Peluncuran Aplikasi Mobile",
    desc: "Menghadirkan pengalaman belanja yang lebih cepat lewat aplikasi TokoKu."
  },
  {
    year: "2026",
    title: "Mitra Regional Terluas",
    desc: "Menjadi salah satu marketplace gadget dengan jaringan mitra terluas di Indonesia."
  }
]

export default function TentangPage() {
  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Navbar />

      {/* Hero */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack gap={2} sx={{ maxWidth: 640 }}>
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: 32, md: 46 }, lineHeight: 1.15 }}
          >
            Tentang TokoKu
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", fontSize: 18 }}
          >
            Marketplace gadget dan elektronik yang lahir dari keresahan
            sederhana: sulitnya menemukan toko online yang jujur soal harga dan
            kualitas.
          </Typography>
        </Stack>
      </Container>

      <Divider />

      {/* Stats */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Stack alignItems={{ xs: "flex-start", md: "center" }} gap={0.5}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: 28, md: 34 },
                    color: "primary.main"
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    textAlign: { xs: "left", md: "center" }
                  }}
                >
                  {stat.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* Cerita Kami */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack
              sx={{
                color: "primary.main",
                mb: 2
              }}
            >
              <EmojiObjectsOutlinedIcon sx={{ fontSize: 36 }} />
            </Stack>
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: 26, md: 32 }, mb: 2 }}
            >
              Cerita Kami
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
              TokoKu adalah marketplace elektronik dan gadget yang lahir dari
              keresahan sederhana: sulitnya menemukan toko online yang jujur
              soal harga dan kualitas.
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Kami bermitra langsung dengan distributor resmi, memilih setiap
              produk berdasarkan uji kualitas, dan memastikan setiap transaksi
              transparan dari awal sampai barang sampai di tangan kamu — tanpa
              markup harga yang tidak masuk akal.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack
              sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                p: { xs: 3, md: 4 }
              }}
              gap={2}
            >
              <Stack direction="row" gap={1.5} alignItems="center">
                <GroupsOutlinedIcon
                  sx={{ color: "primary.main", fontSize: 28 }}
                />
                <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
                  Misi Kami
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Menjadi tempat belanja gadget yang paling dipercaya di Indonesia
                — dengan harga jujur, produk asli, dan layanan yang selalu ada
                untuk pelanggan.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* Nilai-nilai kami */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 28 }, mb: 4 }}>
          Kenapa Memilih TokoKu?
        </Typography>
        <Grid container spacing={4}>
          {values.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
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
      </Container>

      <Divider />

      {/* Timeline perjalanan - zigzag style */}
      <Box
        sx={{
          position: "relative",
          background:
            "radial-gradient(circle at 20% 20%, rgba(14,99,156,0.06), transparent 45%), radial-gradient(circle at 80% 70%, rgba(14,99,156,0.05), transparent 45%)",
          overflow: "hidden"
        }}
      >
        {/* Grid halus */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(14,99,156,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,99,156,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 80%)"
          }}
        />

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 28 }, mb: 1 }}>
            Perjalanan TokoKu
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", mb: 6, maxWidth: 560 }}
          >
            Setiap pencapaian menjadi bagian dari komitmen TokoKu menghadirkan
            belanja gadget yang jujur dan terpercaya di Indonesia.
          </Typography>

          {/* Desktop: zigzag */}
          <Box
            sx={{
              display: { xs: "none", md: "grid" },
              gridTemplateColumns: `repeat(${timeline.length}, 1fr)`,
              columnGap: 3,
              position: "relative",
              minHeight: 380
            }}
          >
            {/* Garis penghubung */}
            <Box
              component="svg"
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: 0
              }}
            >
              <polyline
                points="50,260 150,300 250,120 350,20"
                fill="none"
                stroke="#0E639C"
                strokeOpacity={0.25}
                strokeWidth={2}
              />
              {[
                [50, 260],
                [150, 300],
                [250, 120],
                [350, 20]
              ].map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={4}
                  fill="#0E639C"
                  fillOpacity={0.4}
                />
              ))}
            </Box>

            {timeline.map((item, idx) => {
              const offsets = [10, 15, 5, 0] // rem, makin kecil = makin tinggi posisinya
              return (
                <Box
                  key={item.year}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    alignSelf: "end",
                    mb: `${offsets[idx % offsets.length]}rem`
                  }}
                >
                  <Stack
                    sx={{
                      bgcolor:
                        idx % 2 === 0 ? "background.paper" : "primary.main",
                      color:
                        idx % 2 === 0 ? "text.primary" : "primary.contrastText",
                      borderRadius: 2,
                      p: 2.5,
                      boxShadow: "0 8px 20px -8px rgba(10,36,34,0.25)"
                    }}
                    gap={0.5}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: idx % 2 === 0 ? "primary.main" : "inherit",
                        opacity: idx % 2 === 0 ? 1 : 0.85
                      }}
                    >
                      {item.year}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: idx % 2 === 0 ? "text.secondary" : "inherit",
                        opacity: idx % 2 === 0 ? 1 : 0.9,
                        fontSize: 13
                      }}
                    >
                      {item.desc}
                    </Typography>
                  </Stack>
                </Box>
              )
            })}
          </Box>

          {/* Mobile: vertikal */}
          <Stack gap={0} sx={{ display: { xs: "flex", md: "none" } }}>
            {timeline.map((item, idx) => (
              <Stack
                key={item.year}
                direction="row"
                gap={3}
                sx={{
                  position: "relative",
                  pb: idx === timeline.length - 1 ? 0 : 5
                }}
              >
                <Stack alignItems="center" sx={{ flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      mt: 0.5
                    }}
                  />
                  {idx !== timeline.length - 1 && (
                    <Box
                      sx={{ width: 2, flexGrow: 1, bgcolor: "divider", mt: 1 }}
                    />
                  )}
                </Stack>
                <Stack gap={0.5} sx={{ pb: 1 }}>
                  <Typography
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                      fontSize: 14
                    }}
                  >
                    {item.year}
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: 17 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.desc}
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* CTA */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          gap={3}
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            p: { xs: 4, md: 6 },
            borderRadius: 1
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: 24, md: 28 }, mb: 1 }}
            >
              Punya pertanyaan?
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Tim kami siap membantu kapan pun kamu butuh.
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/kontak"
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#FFFFFF",
              color: "primary.main",
              fontWeight: 600,
              "&:hover": { bgcolor: "#E8F1F8" }
            }}
          >
            Hubungi Kami
          </Button>
        </Stack>
      </Container>

      <Footer />
    </Box>
  )
}
