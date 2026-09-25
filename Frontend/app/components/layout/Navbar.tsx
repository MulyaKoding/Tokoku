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
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip
} from "@mui/material"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined"
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined"
import { useCart } from "@/app/context/CartContext"
import { useAuth } from "@/app/context/AuthContext"
import { usePathname, useRouter } from "next/navigation"

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/products" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Artikel", href: "/artikel" }
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { cartCount } = useCart()
  const { user, isLoggedIn, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  const isMenuOpen = Boolean(anchorEl)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    logout()
    router.push("/")
  }

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
            "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease",
          zIndex: 1100
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
                sx={{ textDecoration: "none", mr: { xs: 2, md: 4 } }}
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
                gap={3.5}
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

                {/* Auth State in Navbar */}
                {isLoggedIn && user ? (
                  <>
                    <Tooltip title="Profil & Akun">
                      <IconButton
                        onClick={handleProfileMenuOpen}
                        size="small"
                        sx={{ ml: 0.5 }}
                      >
                        <Avatar
                          alt={user.name}
                          src={user.avatar}
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "primary.main",
                            fontSize: 14,
                            fontWeight: 600
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </IconButton>
                    </Tooltip>

                    <Menu
                      anchorEl={anchorEl}
                      open={isMenuOpen}
                      onClose={handleMenuClose}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                      PaperProps={{
                        elevation: 3,
                        sx: {
                          mt: 1.5,
                          minWidth: 200,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          overflow: "visible",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                        }
                      }}
                    >
                      <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700 }}
                          noWrap
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {user.email}
                        </Typography>
                      </Box>
                      <Divider />
                      <MenuItem
                        component={Link}
                        href="/products"
                        onClick={handleMenuClose}
                      >
                        <ListItemIcon>
                          <StoreOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        Belanja Produk
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        href="/cart"
                        onClick={handleMenuClose}
                      >
                        <ListItemIcon>
                          <ShoppingCartOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        Keranjang Belanja
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        onClick={handleLogout}
                        sx={{ color: "error.main" }}
                      >
                        <ListItemIcon sx={{ color: "error.main" }}>
                          <LogoutOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        Keluar
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ display: { xs: "none", sm: "flex" } }}
                  >
                    <Button
                      component={Link}
                      href="/login"
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        px: 2,
                        borderColor: "divider",
                        color: "text.primary",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "action.hover"
                        }
                      }}
                    >
                      Masuk
                    </Button>
                    <Button
                      component={Link}
                      href="/register"
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        px: 2,
                        boxShadow: "none"
                      }}
                    >
                      Daftar
                    </Button>
                  </Stack>
                )}

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

      {/* Responsive Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box
          sx={{
            width: 280,
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            height: "100%"
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <StoreOutlinedIcon sx={{ color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                TokoKu
              </Typography>
            </Stack>
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          {/* User Info / Auth Buttons in Mobile */}
          {isLoggedIn && user ? (
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                gap: 1.5
              }}
            >
              <Avatar
                src={user.avatar}
                sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ overflow: "hidden" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                  {user.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  display="block"
                >
                  {user.email}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                fullWidth
                startIcon={<LoginOutlinedIcon />}
                onClick={() => setMobileOpen(false)}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Masuk
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                fullWidth
                startIcon={<HowToRegOutlinedIcon />}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "none"
                }}
              >
                Daftar Akun
              </Button>
            </Stack>
          )}

          <Divider sx={{ mb: 1 }} />

          <List sx={{ flexGrow: 1 }}>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.href}
                component={Link}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>

          {isLoggedIn && (
            <Box sx={{ pt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<LogoutOutlinedIcon />}
                onClick={() => {
                  setMobileOpen(false)
                  logout()
                  router.push("/")
                }}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Keluar
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  )
}
