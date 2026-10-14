import type { Metadata } from "next"
import { spaceGrotesk, inter } from "./theme"
import ThemeRegistry from "./ThemeRegistry"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import WhatsAppFloatingButton from "./components/common/WhatsAppFloatingButton"
import "./globals.css"

export const metadata: Metadata = {
  title: "TokoKu — Gawai pilihan, harga jujur",
  description: "Marketplace gadget dan elektronik terpercaya.",
  icons: {
    icon: [
      { url: "/tokoku-icon.png?v=2", sizes: "512x512", type: "image/png" },
      { url: "/icon.png?v=2", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico?v=2", sizes: "any" }
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }
    ],
    shortcut: ["/tokoku-icon.png?v=2"]
  }
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/tokoku-icon.png?v=2" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/tokoku-icon.png?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
      </head>
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <CartProvider>
              {children}
              <WhatsAppFloatingButton />
            </CartProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
