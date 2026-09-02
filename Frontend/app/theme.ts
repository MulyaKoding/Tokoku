import { createTheme } from "@mui/material/styles"
import { Space_Grotesk, Inter } from "next/font/google"

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap"
})

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap"
})

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F5F6F3",
      paper: "#FFFFFF"
    },
    text: {
      primary: "#14181B",
      secondary: "#5B6560"
    },
    primary: {
      main: "#0E639C",
      light: "#1177BB",
      dark: "#094771",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#C9922B",
      light: "#DBAE5C",
      dark: "#A5741C",
      contrastText: "#14181B"
    },
    divider: "#E3E2DC"
  },
  shape: {
    borderRadius: 4
  },
  typography: {
    fontFamily: "var(--font-body), Inter, sans-serif",
    h1: {
      fontFamily: "var(--font-display), sans-serif",
      fontWeight: 600,
      letterSpacing: "-0.01em"
    },
    h2: {
      fontFamily: "var(--font-display), sans-serif",
      fontWeight: 600,
      letterSpacing: "-0.01em"
    },
    h3: { fontFamily: "var(--font-display), sans-serif", fontWeight: 600 },
    h4: { fontFamily: "var(--font-display), sans-serif", fontWeight: 600 },
    h5: { fontFamily: "var(--font-display), sans-serif", fontWeight: 600 },
    h6: { fontFamily: "var(--font-display), sans-serif", fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 10
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: "none",
          border: "1px solid #E3E2DC"
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid #E3E2DC"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 2 }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" }
      }
    }
  }
})

export default theme
