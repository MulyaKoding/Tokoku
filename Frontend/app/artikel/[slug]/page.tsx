"use client"

import Footer from "@/app/components/layout/Footer"
import Navbar from "@/app/components/layout/Navbar"
import { getArticleBySlug, getRelatedArticles } from "@/app/lib/articles"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import {
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography
} from "@mui/material"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"

export default function ArtikelDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const related = getRelatedArticles(article.slug, article.category)

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Back link */}
        <Stack
          direction="row"
          alignItems="center"
          gap={0.5}
          component={Link}
          href="/artikel"
          sx={{
            textDecoration: "none",
            color: "text.secondary",
            mb: 3,
            fontSize: 14,
            "&:hover": { color: "primary.main" }
          }}
        >
          <ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />
          Kembali ke Artikel
        </Stack>

        {/* Header */}
        <Chip
          label={article.category}
          size="small"
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontWeight: 600,
            mb: 2
          }}
        />
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 26, md: 36 },
            fontWeight: 700,
            lineHeight: 1.25,
            mb: 2
          }}
        >
          {article.title}
        </Typography>

        <Stack direction="row" gap={3} flexWrap="wrap" sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <CalendarTodayOutlinedIcon
              sx={{ fontSize: 16, color: "text.secondary" }}
            />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {article.date}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <AccessTimeOutlinedIcon
              sx={{ fontSize: 16, color: "text.secondary" }}
            />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {article.readTime}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Oleh {article.author}
          </Typography>
        </Stack>

        {/* Featured image */}
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: 3,
            overflow: "hidden",
            mb: 4
          }}
        >
          <Box
            component="img"
            src={article.image}
            alt={article.title}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        {/* Content */}
        <Stack gap={2.5} sx={{ mb: 6 }}>
          {article.content.map((paragraph, idx) => (
            <Typography
              key={idx}
              variant="body1"
              sx={{ color: "text.primary", lineHeight: 1.8, fontSize: 16 }}
            >
              {paragraph}
            </Typography>
          ))}
        </Stack>

        <Divider sx={{ mb: 6 }} />

        {/* Related articles */}
        {related.length > 0 && (
          <Stack gap={3}>
            <Typography variant="h5" sx={{ fontSize: 22, fontWeight: 700 }}>
              Artikel Terkait
            </Typography>
            <Grid container spacing={3}>
              {related.map((item) => (
                <Grid item xs={12} sm={4} key={item.slug}>
                  <Box
                    component={Link}
                    href={`/artikel/${item.slug}`}
                    sx={{
                      display: "block",
                      textDecoration: "none",
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "transform 0.2s ease",
                      "&:hover": { transform: "translateY(-3px)" }
                    }}
                  >
                    <Box
                      sx={{
                        aspectRatio: "16 / 10",
                        overflow: "hidden"
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </Box>
                    <Stack sx={{ p: 2 }} gap={0.5}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: 14,
                          lineHeight: 1.3,
                          color: "text.primary"
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {item.date}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}
      </Container>

      <Footer />
    </Box>
  )
}
