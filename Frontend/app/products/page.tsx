"use client"

import Footer from "@/app/components/layout/Footer"
import Navbar from "@/app/components/layout/Navbar"
import { useCart } from "@/app/context/CartContext"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined"
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import { useMemo, useState } from "react"

type Product = {
  id: string
  name: string
  category: string
  price: number
  image: string
}

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Polaroid OneStep 2",
    category: "Kamera",
    price: 1850000,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80"
  },
  {
    id: "2",
    name: "Studio Headphone Pro",
    category: "Audio",
    price: 950000,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
  },
  {
    id: "3",
    name: "Smartwatch Fit Series",
    category: "Wearable",
    price: 1250000,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
  },
  {
    id: "4",
    name: "Mechanical Keyboard Aksesori",
    category: "Aksesori",
    price: 750000,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80"
  },
  {
    id: "5",
    name: "UltraBook 14 Pro",
    category: "Laptop",
    price: 12500000,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80"
  },
  {
    id: "6",
    name: "Smartphone X200",
    category: "Smartphone",
    price: 4500000,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
  },
  {
    id: "7",
    name: "Gamepad Elite Wireless",
    category: "Gaming",
    price: 899000,
    image:
      "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=500&q=80"
  },
  {
    id: "8",
    name: "Portable Speaker Boom",
    category: "Speaker",
    price: 650000,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80"
  },
  {
    id: "9",
    name: "AeroDrone 4K",
    category: "Drone",
    price: 6200000,
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80"
  },
  {
    id: "10",
    name: 'Monitor UltraWide 27"',
    category: "Monitor",
    price: 3400000,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"
  }
]

const categories = [
  "Semua",
  ...Array.from(new Set(PRODUCTS.map((p) => p.category)))
]

const sortOptions = [
  { value: "default", label: "Terbaru" },
  { value: "price-asc", label: "Harga: Rendah ke Tinggi" },
  { value: "price-desc", label: "Harga: Tinggi ke Rendah" },
  { value: "name-asc", label: "Nama: A-Z" }
]

const ITEMS_PER_PAGE = 8

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(value)
}

export default function ProductsPage() {
  const { addToCart } = useCart()

  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [sortBy, setSortBy] = useState("default")
  const [page, setPage] = useState(1)
  const [categoryInput, setCategoryInput] = useState("Semua")

  const filtered = useMemo(() => {
    let result = [...PRODUCTS]

    if (activeCategory !== "Semua") {
      result = result.filter((p) => p.category === activeCategory)
    }

    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [search, activeCategory, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Header */}
        <Stack gap={1} sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700 }}
          >
            Semua Produk
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Temukan gadget pilihan dengan harga jujur dan garansi resmi.
          </Typography>
        </Stack>

        {/* Search (category autocomplete) + Sort */}
        <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mb: 4 }}>
          <Autocomplete
            fullWidth
            options={categories}
            value={activeCategory}
            inputValue={categoryInput}
            onInputChange={(_, newInputValue, reason) => {
              setCategoryInput(newInputValue)

              if (reason === "clear" || newInputValue.trim() === "") {
                handleCategoryClick("Semua")
                return
              }

              const match = categories.find(
                (c) => c.toLowerCase() === newInputValue.trim().toLowerCase()
              )
              if (match) {
                handleCategoryClick(match)
              }
            }}
            onChange={(_, value) => {
              handleCategoryClick(value || "Semua")
              setCategoryInput(value || "Semua")
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "background.paper"
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Cari kategori produk..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  )
                }}
              />
            )}
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            IconComponent={TuneOutlinedIcon}
            sx={{
              minWidth: { xs: "100%", sm: 240 },
              borderRadius: 2,
              bgcolor: "background.paper"
            }}
          >
            {sortOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {/* Result count */}
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          Menampilkan {paginated.length} dari {filtered.length} produk
        </Typography>

        {/* Product grid */}
        {paginated.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              color: "text.secondary"
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Produk tidak ditemukan
            </Typography>
            <Typography variant="body2">
              Coba ubah kata kunci pencarian atau kategori.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {paginated.map((product) => (
              <Grid item xs={6} sm={4} md={3} key={product.id}>
                <Box
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px -8px rgba(10,36,34,0.2)"
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      aspectRatio: "1 / 1",
                      overflow: "hidden"
                    }}
                  >
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: "rgba(245,246,243,0.9)",
                        fontWeight: 600,
                        fontSize: 11
                      }}
                    />
                  </Box>

                  <Stack
                    sx={{ p: 2, flexGrow: 1 }}
                    justifyContent="space-between"
                    gap={1.5}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 14,
                        lineHeight: 1.3,
                        minHeight: 36
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          fontSize: 15
                        }}
                      >
                        {formatRupiah(product.price)}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          addToCart?.({
                            id: Number(product.id),
                            name: product.name,
                            category: product.category,
                            price: product.price,
                            image: product.image,
                            rating: 0
                          })
                        }
                        sx={{
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          "&:hover": { bgcolor: "primary.dark" }
                        }}
                      >
                        <ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Stack alignItems="center" sx={{ mt: 5 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Stack>
        )}
      </Container>

      <Footer />
    </Box>
  )
}
