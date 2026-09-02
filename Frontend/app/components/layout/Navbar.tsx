"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Stack,
  Button,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import { useCart } from "@/app/context/CartContext";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/products" },
  { label: "Tentang", href: "/#tentang" },
  { label: "Kontak", href: "/#kontak" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <>
      <AppBar position="sticky" color="inherit" sx={{ bgcolor: "background.paper" }}>
        <Toolbar sx={{ gap: 3, py: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            component={Link}
            href="/"
            sx={{ textDecoration: "none", mr: 2 }}
          >
            <StoreOutlinedIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em", color: "text.primary" }}>
              TokoKu
            </Typography>
          </Stack>

          <Stack
            direction="row"
            gap={3}
            sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}
          >
            {navLinks.map((link) => (
              <Typography
                key={link.href}
                component={Link}
                href={link.href}
                sx={{
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Stack>

          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

          <Button
            component={Link}
            href="/products"
            variant="contained"
            color="primary"
            size="small"
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            Belanja Sekarang
          </Button>

          <IconButton component={Link} href="/cart" sx={{ color: "text.primary" }}>
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>

          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" }, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 260, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 1 }} />
          <List>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.href}
                component={Link}
                href={link.href}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}