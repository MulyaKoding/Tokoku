import type { Metadata } from "next";
import { spaceGrotesk, inter } from "./theme";
import ThemeRegistry from "./ThemeRegistry";
import { CartProvider } from "./context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "TokoKu — Gawai pilihan, harga jujur",
  description: "Marketplace gadget dan elektronik terpercaya.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <ThemeRegistry>
          <CartProvider>{children}</CartProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}