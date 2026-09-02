"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Stack,
  Button,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider
} from "@mui/material"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined"
import { useCart } from "@/app/context/CartContext"
import { usePathname } from "next/navigation"

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/products" },
  { label: "Tentang", href: "/tentang" },
  { label: "Kontak", href: "/#kontak" }
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { cartCount } = useCart()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          top: 0,
          bgcolor: scrolled ? "transparent" : "rgba(245, 246, 243, 0.85)",
          backdropFilter: scrolled ? "none" : "blur(8px)",
          borderBottom: scrolled ? "none" : "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          py: scrolled ? 1.5 : 0,
          transition:
            "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease"
        }}
      >
        <Container
          maxWidth={scrolled ? "md" : "lg"}
          disableGutters={!scrolled}
          sx={{
            transition: "max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          <Box
            sx={{
              bgcolor: scrolled ? "rgba(245, 246, 243, 0.85)" : "transparent",
              backdropFilter: scrolled ? "blur(8px)" : "none",
              border: scrolled ? "1px solid" : "none",
              borderColor: "divider",
              borderRadius: scrolled ? 999 : 0,
              boxShadow: scrolled
                ? "0 8px 24px -8px rgba(10,36,34,0.18)"
                : "none",
              transition:
                "border-radius 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease, background-color 0.2s ease"
            }}
          >
            <Toolbar
              disableGutters
              sx={{
                py: scrolled ? 0.75 : 1.5,
                px: scrolled ? 2 : { xs: 2, sm: 3, md: 4 },
                minHeight: "auto",
                transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={1}
                component={Link}
                href="/"
                sx={{ textDecoration: "none", mr: { xs: 2, md: 5 } }}
              >
                <StoreOutlinedIcon
                  sx={{ color: "primary.main", fontSize: 26 }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "text.primary"
                  }}
                >
                  TokoKu
                </Typography>
              </Stack>

              <Stack
                direction="row"
                gap={4}
                sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}
              >
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname === link.href ||
                        pathname.startsWith(link.href + "/")

                  return (
                    <Typography
                      key={link.href}
                      component={Link}
                      href={link.href}
                      sx={{
                        textDecoration: "none",
                        fontSize: 14,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "primary.main" : "text.secondary",
                        position: "relative",
                        transition: "color 0.2s ease",
                        "&:hover": { color: "primary.main" },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: -6,
                          height: 2,
                          borderRadius: 1,
                          bgcolor: isActive ? "primary.main" : "transparent"
                        }
                      }}
                    >
                      {link.label}
                    </Typography>
                  )
                })}
              </Stack>

              <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

              <Stack direction="row" alignItems="center" gap={1.5}>
                <Button
                  component={Link}
                  href="/products"
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{
                    display: { xs: "none", sm: "inline-flex" },
                    borderRadius: 2,
                    textTransform: "none",
                    px: 2.5,
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" }
                  }}
                >
                  Belanja Sekarang
                </Button>

                <IconButton
                  component={Link}
                  href="/cart"
                  sx={{
                    color: "text.primary",
                    bgcolor: "action.hover",
                    "&:hover": { bgcolor: "action.selected" }
                  }}
                >
                  <Badge badgeContent={cartCount} color="secondary">
                    <ShoppingCartOutlinedIcon fontSize="small" />
                  </Badge>
                </IconButton>

                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{
                    display: { xs: "inline-flex", md: "none" },
                    color: "text.primary"
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Stack>
            </Toolbar>
          </Box>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box sx={{ width: 260, p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
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
  )
}
