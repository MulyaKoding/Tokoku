"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Paper,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Fab,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Add as AddIcon,
  Star as StarIcon,
  Store as StoreIcon,
} from "@mui/icons-material";

type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
};

const initialProducts: Product[] = [
  { id: 1, name: "Kamera Digital DSLR", price: 5500000, rating: 4.5, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600&h=400" },
  { id: 2, name: "Headphone Wireless", price: 1200000, rating: 4.8, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600&h=400" },
  { id: 3, name: "Smartwatch Sport", price: 2100000, rating: 4.2, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600&h=400" },
];

export default function EcommercePage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newRating, setNewRating] = useState("5");

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    const newProduct: Product = {
      id: Date.now(),
      name: newName,
      price: parseInt(newPrice),
      rating: parseFloat(newRating),
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=600&h=400",
    };

    setProducts([newProduct, ...products]);
    setNewName("");
    setNewPrice("");
    setNewRating("5");
    setShowAddForm(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", pb: 12 }}>
      {/* ─── HEADER ─── */}
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }} variant="rounded">
              <StoreIcon fontSize="small" />
            </Avatar>
            <Typography variant="h6" color="primary" fontWeight="bold" noWrap>
              TokoKu
            </Typography>
          </Box>

          {/* Tombol Tambah Barang di Header (mobile) */}
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
            <IconButton
              color={showAddForm ? "default" : "primary"}
              onClick={() => setShowAddForm(!showAddForm)}
              size="small"
              sx={{ bgcolor: showAddForm ? "grey.200" : "primary.main", color: showAddForm ? "text.primary" : "white", borderRadius: 1.5, p: 0.8 }}
            >
              {showAddForm ? <CloseIcon fontSize="small" /> : <AddIcon fontSize="small" />}
            </IconButton>
          </Box>

          {/* Profile */}
          <Tooltip title="Menu Profil">
            <IconButton onClick={handleProfileMenuOpen} color="inherit" size="small">
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 13, fontWeight: "bold" }}>AD</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{ sx: { mt: 1, minWidth: 200 } }}
          >
            <Box px={2} py={1}>
              <Typography variant="caption" color="text.secondary">Masuk sebagai</Typography>
              <Typography variant="body2" fontWeight="medium">admin@tokoku.com</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfileMenuClose}>Pengaturan Akun</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>Pesanan Saya</MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileMenuClose} sx={{ color: "error.main" }}>Keluar</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, sm: 3 } }}>
        {/* ─── PAGE TITLE ROW ─── */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 0 },
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
              Dashboard Penjualan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kelola data barang dan pantau produk Anda.
            </Typography>
          </Box>
          {/* Tombol Tambah Barang — hanya tampil di desktop */}
          <Button
            variant="contained"
            color={showAddForm ? "inherit" : "primary"}
            startIcon={showAddForm ? <CloseIcon /> : <AddIcon />}
            onClick={() => setShowAddForm(!showAddForm)}
            disableElevation
            size="small"
            sx={{ display: { xs: "none", md: "inline-flex" }, whiteSpace: "nowrap" }}
          >
            {showAddForm ? "Batal" : "Buat Data Barang"}
          </Button>
        </Box>

        {/* ─── FORM TAMBAH BARANG ─── */}
        {showAddForm && (
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 3, border: "1px solid", borderColor: "grey.200", borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Tambah Barang Baru
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <form onSubmit={handleAddProduct}>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    required
                    label="Nama Barang"
                    variant="outlined"
                    size="small"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Harga (Rp)"
                    variant="outlined"
                    size="small"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="rating-label">Rating Awal</InputLabel>
                    <Select
                      labelId="rating-label"
                      label="Rating Awal"
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value as string)}
                    >
                      <MenuItem value="5">5 Bintang</MenuItem>
                      <MenuItem value="4.5">4.5 Bintang</MenuItem>
                      <MenuItem value="4">4 Bintang</MenuItem>
                      <MenuItem value="3">3 Bintang</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button fullWidth type="submit" variant="contained" color="success" disableElevation>
                    Simpan Barang
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        )}

        {/* ─── PRODUCT GRID ─── */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {products.map((product) => (
            <Grid item xs={6} sm={6} md={4} lg={3} key={product.id}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Gambar dengan rasio 4:3 yang konsisten */}
                <Box
                  sx={{
                    width: "100%",
                    paddingTop: "75%", // rasio 4:3
                    position: "relative",
                    overflow: "hidden",
                    bgcolor: "grey.100",
                  }}
                >
                  <Box
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 }, pb: "8px !important" }}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    noWrap
                    title={product.name}
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    fontWeight="bold"
                    mt={0.5}
                    sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
                  >
                    {formatPrice(product.price)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, gap: 0.25 }}>
                    <StarIcon sx={{ color: "#faaf00", fontSize: { xs: 14, sm: 18 } }} />
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">
                      {product.rating} / 5.0
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
                  <Button fullWidth variant="outlined" color="primary" size="small">
                    Edit Barang
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {products.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              Belum ada data barang. Silakan tambah barang baru.
            </Typography>
          </Box>
        )}
      </Container>

      {/* ─── CHAT WIDGET ─── */}
      <Box sx={{ position: "fixed", bottom: { xs: 16, sm: 24 }, right: { xs: 16, sm: 24 }, zIndex: 1300, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        {isChatOpen && (
          <Paper elevation={8} sx={{ width: { xs: "calc(100vw - 32px)", sm: 320 }, mb: 2, borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ bgcolor: "primary.main", color: "white", px: 2, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle2" fontWeight="bold">Customer Support Chat</Typography>
              <IconButton size="small" sx={{ color: "white" }} onClick={() => setIsChatOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ height: 240, bgcolor: "grey.50", p: 2, overflowY: "auto" }}>
              <Paper elevation={1} sx={{ p: 1.5, maxWidth: "80%", bgcolor: "white", borderRadius: 2, borderTopLeftRadius: 0 }}>
                <Typography variant="body2">
                  Halo! Ada yang bisa kami bantu seputar penjualan Anda hari ini?
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ p: 1.5, bgcolor: "white", borderTop: "1px solid", borderColor: "grey.200" }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ketik pesan..."
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <IconButton
                  color="primary"
                  sx={{ bgcolor: "primary.main", color: "white", borderRadius: 2, "&:hover": { bgcolor: "primary.dark" }, flexShrink: 0 }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        )}

        <Fab
          color={isChatOpen ? "error" : "primary"}
          aria-label="chat"
          onClick={() => setIsChatOpen(!isChatOpen)}
          size="medium"
        >
          {isChatOpen ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </Box>
    </Box>
  );
}
