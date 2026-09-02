import Link from "next/link";
import { Box, Container, Stack, Typography, Divider } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" id="kontak" sx={{ bgcolor: "background.paper" }}>
      <Divider />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          gap={4}
          sx={{ mb: 4 }}
        >
          <Box sx={{ maxWidth: 320 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              TokoKu
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Marketplace gadget dan elektronik terkurasi dengan harga transparan
              dan garansi resmi.
            </Typography>
          </Box>

          <Stack direction="row" gap={6}>
            <Stack gap={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Belanja
              </Typography>
              <Typography component={Link} href="/products" variant="body2" sx={{ color: "text.secondary", textDecoration: "none" }}>
                Semua Produk
              </Typography>
              <Typography component={Link} href="/cart" variant="body2" sx={{ color: "text.secondary", textDecoration: "none" }}>
                Keranjang
              </Typography>
            </Stack>
            <Stack gap={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Bantuan
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                cs@tokoku.id
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                0812-3456-7890
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          © {new Date().getFullYear()} TokoKu.
        </Typography>
      </Container>
    </Box>
  );
}