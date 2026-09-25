"use client"

import Footer from "@/app/components/layout/Footer"
import Navbar from "@/app/components/layout/Navbar"
import { articles } from "@/app/lib/articles"
import { Box, Chip, Container, Grid, Stack, Typography } from "@mui/material"
import Link from "next/link"

export default function ArtikelPage() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Header */}
        <Stack gap={1} sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700 }}
          >
            Artikel & Tips
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Panduan, tips, dan insight seputar dunia gadget dan elektronik dari
            tim TokoKu.
          </Typography>
        </Stack>

        {/* Grid artikel */}
        <Grid container spacing={3}>
          {articles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.slug}>
              <Box
                component={Link}
                href={`/artikel/${article.slug}`}
                sx={{
                  display: "block",
                  textDecoration: "none",
                  bgcolor: "background.paper",
                  borderRadius: 3,
                  overflow: "hidden",
                  height: "100%",
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
                    aspectRatio: "16 / 10",
                    overflow: "hidden"
                  }}
                >
                  <Box
                    component="img"
                    src={article.image}
                    alt={article.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <Chip
                    label={article.category}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      fontWeight: 600,
                      fontSize: 11
                    }}
                  />
                </Box>

                <Stack sx={{ p: 2.5 }} gap={1}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 17,
                      lineHeight: 1.35,
                      color: "text.primary"
                    }}
                  >
                    {article.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {article.excerpt}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mt: 0.5 }}
                  >
                    {article.date} • {article.readTime}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  )
}
