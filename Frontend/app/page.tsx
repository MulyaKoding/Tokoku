"use client"

import Footer from "@/app/components/layout/Footer"
import Navbar from "@/app/components/layout/Navbar"
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined"
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined"
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined"
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined"
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
import { useEffect, useRef, useState } from "react"

const highlights = [
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

const categoryPreviews = [
  {
    name: "Kamera",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80"
  },
  {
    name: "Audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
  },
  {
    name: "Wearable",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
  },
  {
    name: "Aksesori",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80"
  },
  {
    name: "Laptop",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80"
  },
  {
    name: "Smartphone",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
  },
  {
    name: "Gaming",
    image:
      "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=500&q=80"
  },
  {
    name: "Speaker",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80"
  },
  {
    name: "Drone",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80"
  },
  {
    name: "Monitor",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"
  }
]

const AUTOPLAY_DELAY = 3500

function HeroCarousel({
  images
}: {
  images: { name: string; image: string }[]
}) {
  const extended = [images[images.length - 1], ...images, images[0]]

  const [index, setIndex] = useState(1)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const dragStartX = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const containerWidth = useRef(0)

  const SLIDE_WIDTH_PERCENT = 76
  const GAP = 16

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goNext = () => {
    setIndex((prev) => {
      if (prev >= extended.length - 1) return prev
      return prev + 1
    })
  }

  const goPrev = () => {
    setIndex((prev) => {
      if (prev <= 0) return prev
      return prev - 1
    })
  }

  const activeRealIndex =
    (((index - 1) % images.length) + images.length) % images.length

  const handleDragStart = (clientX: number) => {
    if (containerRef.current) {
      containerWidth.current = containerRef.current.offsetWidth
    }
    setIsDragging(true)
    dragStartX.current = clientX
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    setDragOffset(clientX - dragStartX.current)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    const threshold = containerWidth.current * 0.15
    if (dragOffset < -threshold) goNext()
    else if (dragOffset > threshold) goPrev()
    setDragOffset(0)
  }

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return

    if (index === extended.length - 1) {
      setTransitionEnabled(false)
      setIndex(1)
    } else if (index === 0) {
      setTransitionEnabled(false)
      setIndex(images.length)
    }
  }

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (index === extended.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setTransitionEnabled(false)
        setIndex(1)
      }, 920)
    } else if (index === 0) {
      timeoutRef.current = setTimeout(() => {
        setTransitionEnabled(false)
        setIndex(images.length)
      }, 920)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [index])

  useEffect(() => {
    if (transitionEnabled) return
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setTransitionEnabled(true))
    })
    return () => cancelAnimationFrame(raf1)
  }, [transitionEnabled])
  const baseOffset = 50 - SLIDE_WIDTH_PERCENT / 2 - index * SLIDE_WIDTH_PERCENT

  useEffect(() => {
    if (isDragging || isHovered) return

    const timer = setInterval(() => {
      goNext()
    }, AUTOPLAY_DELAY)

    return () => clearInterval(timer)
  }, [index, isDragging, isHovered])

  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: 520,
        mx: "auto",
        animation: "floatHero 4s ease-in-out infinite",
        "@keyframes floatHero": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" }
        }
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          overflow: "hidden",
          cursor: isDragging ? "grabbing" : "grab",
          py: 1,
          minHeight: { xs: 220, sm: 280 }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => {
          setIsHovered(false)
          handleDragEnd()
        }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <Stack
          direction="row"
          sx={{
            gap: `${GAP}px`,
            transform: `translateX(calc(${baseOffset}% - ${
              index * GAP
            }px + ${dragOffset}px))`,
            transition:
              isDragging || !transitionEnabled
                ? "none"
                : "transform 0.9s cubic-bezier(0.65, 0, 0.35, 1)"
          }}
        >
          {extended.map((img, i) => {
            const isActive = i === index
            return (
              <Box
                key={i}
                sx={{
                  position: "relative",
                  flex: `0 0 ${SLIDE_WIDTH_PERCENT}%`,
                  aspectRatio: "4 / 3",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: isActive
                    ? "0 20px 40px -12px rgba(10, 36, 34, 0.35)"
                    : "0 8px 20px -8px rgba(10, 36, 34, 0.2)",
                  opacity: isActive ? 1 : 0.5,
                  transform: isActive ? "scale(1)" : "scale(0.92)",
                  transition:
                    "opacity 0.9s cubic-bezier(0.65, 0, 0.35, 1), transform 0.9s cubic-bezier(0.65, 0, 0.35, 1)"
                }}
              >
                <Box
                  component="img"
                  src={img.image}
                  alt={img.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    userSelect: "none",
                    pointerEvents: "none"
                  }}
                  draggable={false}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(10,36,34,0.45), transparent 40%)",
                    display: "flex",
                    alignItems: "flex-end",
                    p: 2,
                    pointerEvents: "none"
                  }}
                >
                  <Typography sx={{ color: "#F5F6F3", fontWeight: 600 }}>
                    {img.name}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Stack>
      </Box>

      <Stack direction="row" gap={0.8} justifyContent="center" sx={{ mt: 2 }}>
        {images.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i + 1)}
            role="button"
            aria-label={`Ke slide ${i + 1}: ${images[i].name}`}
            sx={{
              width: i === activeRealIndex ? 18 : 6,
              height: 6,
              borderRadius: 3,
              bgcolor:
                i === activeRealIndex
                  ? "primary.main"
                  : "action.disabledBackground",
              cursor: "pointer",
              transition: "width 0.3s ease"
            }}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Navbar />

      {/* Hero */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={5}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: 34, md: 46 }, lineHeight: 1.15, mb: 3 }}
            >
              Gawai pilihan,
              <br />
              harga jujur.
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", mb: 4, maxWidth: 420 }}
            >
              TokoKu mengurasi kamera, audio, dan wearable dari brand tepercaya
              — tanpa markup harga yang tidak masuk akal.
            </Typography>
            <Stack direction="row" gap={2} sx={{ mb: 4 }}>
              <Button
                component={Link}
                href="/products"
                variant="contained"
                color="primary"
                size="large"
              >
                Belanja Sekarang
              </Button>
              <Button
                component={Link}
                href="/#tentang"
                variant="outlined"
                color="primary"
                size="large"
              >
                Tentang Kami
              </Button>
            </Stack>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Gratis ongkir se-Indonesia • Garansi resmi 1 tahun
            </Typography>
          </Grid>

          <Grid item xs={12} md={7}>
            <HeroCarousel images={categoryPreviews} />
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* Tentang / Description */}
      <Container maxWidth="lg" id="tentang" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={5}>
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: 28, md: 34 }, mb: 2 }}
            >
              Tentang TokoKu
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              TokoKu adalah marketplace elektronik dan gadget yang lahir dari
              keresahan sederhana: sulitnya menemukan toko online yang jujur
              soal harga dan kualitas. Kami bermitra langsung dengan distributor
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
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
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

      {/* Kategori preview - auto sliding */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
            sx={{ mb: 3 }}
          >
            <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 28 } }}>
              Jelajahi Kategori
            </Typography>
            <Typography
              component={Link}
              href="/products"
              variant="body2"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              Lihat semua produk
            </Typography>
          </Stack>
        </Container>

        <Box
          sx={{
            overflow: "hidden",
            width: "100%",
            maskImage:
              "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 5%, black 95%, transparent)"
          }}
        >
          <Stack
            direction="row"
            gap={2}
            sx={{
              width: "max-content",
              animation: "slideCategories 30s linear infinite",
              "@keyframes slideCategories": {
                "0%": { transform: "translateX(-50%)" },
                "100%": { transform: "translateX(0%)" }
              },
              "&:hover": {
                animationPlayState: "paused"
              }
            }}
          >
            {[...categoryPreviews, ...categoryPreviews].map((cat, idx) => (
              <Box
                key={`${cat.name}-${idx}`}
                component={Link}
                href={`/products?category=${cat.name}`}
                sx={{
                  position: "relative",
                  display: "block",
                  borderRadius: 1,
                  overflow: "hidden",
                  width: 220,
                  height: 160,
                  flexShrink: 0,
                  textDecoration: "none",
                  "&:hover .category-img": {
                    transform: "scale(1.1)"
                  }
                }}
              >
                <Box
                  component="img"
                  src={cat.image}
                  alt={cat.name}
                  className="category-img"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease"
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(10, 36, 34, 0.35)",
                    display: "flex",
                    alignItems: "flex-end",
                    p: 1.5
                  }}
                >
                  <Typography sx={{ color: "#F5F6F3", fontWeight: 600 }}>
                    {cat.name}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
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
            bgcolor: "#0E639C",
            color: "#FFFFFF",
            p: { xs: 4, md: 6 },
            borderRadius: 1
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: 24, md: 28 }, mb: 1 }}
            >
              Siap upgrade gadget kamu?
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Ribuan produk elektronik pilihan menunggu di TokoKu.
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#FFFFFF",
              color: "#0E639C",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#E8F1F8"
              }
            }}
          >
            Mulai Belanja
          </Button>
        </Stack>
      </Container>

      <Footer />
    </Box>
  )
}
