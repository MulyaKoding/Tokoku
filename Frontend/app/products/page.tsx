"use client"

import Footer from "@/app/components/layout/Footer"
import Navbar from "@/app/components/layout/Navbar"
import { useRouter } from "next/navigation"
import { useCart } from "@/app/context/CartContext"
import { useProducts } from "@/app/hooks/useProducts"
import Link from "next/link"
import { formatRupiah } from "@/app/lib/products"
import {
  CATEGORIES_ALL,
  ITEMS_PER_PAGE,
  SORT_OPTIONS
} from "@/app/lib/constants"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined"
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
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

export default function ProductsPage() {
  const { addToCart } = useCart()
  const router = useRouter()
  const { products, loading } = useProducts()

  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState(CATEGORIES_ALL)
  const [sortBy, setSortBy] = useState("default")
  const [page, setPage] = useState(1)
  const [categoryInput, setCategoryInput] = useState(CATEGORIES_ALL)

  const categories = useMemo(() => {
    return [
      CATEGORIES_ALL,
      ...Array.from(new Set(products.map((p) => p.category)))
    ]
  }, [products])

  const filtered = useMemo(() => {
    let result = [...products]

    if (activeCategory !== CATEGORIES_ALL) {
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
  }, [products, search, activeCategory, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat)
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

        {/* Search & Filter */}
        <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mb: 4 }}>
          <Autocomplete
            fullWidth
            options={categories}
            value={activeCategory}
            inputValue={categoryInput}
            onInputChange={(_, newInputValue, reason) => {
              setCategoryInput(newInputValue)

              if (reason === "clear" || newInputValue.trim() === "") {
                handleCategoryClick(CATEGORIES_ALL)
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
              handleCategoryClick(value || CATEGORIES_ALL)
              setCategoryInput(value || CATEGORIES_ALL)
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
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {/* Loading Spinner */}
        {loading ? (
          <Box sx={{ py: 10, textAlign: "center" }}>
            <CircularProgress color="primary" />
            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              Memuat data produk...
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Menampilkan {paginated.length} dari {filtered.length} produk
            </Typography>

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
                      component={Link}
                      href={`/products/${product.id}`}
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 3,
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        textDecoration: "none",
                        color: "inherit",
                        transition:
                          "transform 0.25s ease, box-shadow 0.25s ease",
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
                        sx={{ p: 1.5, flexGrow: 1 }}
                        justifyContent="space-between"
                        gap={1}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: 13,
                            lineHeight: 1.3,
                            minHeight: 32
                          }}
                        >
                          {product.name}
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "primary.main",
                            fontSize: 14
                          }}
                        >
                          {formatRupiah(product.price)}
                        </Typography>

                        <Stack
                          direction="row"
                          gap={0.5}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addToCart(product)
                            }}
                            sx={{
                              border: "1px solid",
                              borderColor: "primary.main",
                              color: "primary.main",
                              borderRadius: 1,
                              p: 0.4
                            }}
                          >
                            <ShoppingCartOutlinedIcon sx={{ fontSize: 13 }} />
                          </IconButton>

                          <Button
                            variant="contained"
                            disableElevation
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addToCart(product)
                              router.push("/checkout")
                            }}
                            sx={{
                              borderRadius: 1,
                              textTransform: "none",
                              fontWeight: 600,
                              fontSize: 11,
                              py: 0.4,
                              minHeight: 0,
                              lineHeight: 1.4
                            }}
                          >
                            Beli
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}

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
          </>
        )}
      </Container>

      <Footer />
    </Box>
  )
}
