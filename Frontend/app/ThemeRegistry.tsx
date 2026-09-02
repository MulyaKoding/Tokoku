"use client"

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import { ThemeProvider, CssBaseline } from "@mui/material"
import theme from "./theme"

export default function ThemeRegistry({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
