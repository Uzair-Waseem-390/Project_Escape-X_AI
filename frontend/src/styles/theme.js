/**
 * PROJECT ESCAPE-X AI — GLOBAL THEME
 * Single source of truth for all design tokens.
 * Import this in any component that needs theme values.
 */

export const theme = {
  colors: {
    // Backgrounds
    bg: {
      primary: "#0a0b0d",
      secondary: "#0f1114",
      card: "#13161a",
      cardHover: "#181c21",
      overlay: "rgba(10,11,13,0.85)",
    },
    // Primary brand — military red alert
    red: {
      50: "#fff1f1",
      100: "#ffe0e0",
      400: "#ff5252",
      500: "#e53935",
      600: "#c62828",
      700: "#b71c1c",
      glow: "rgba(229,57,53,0.35)",
      subtle: "rgba(229,57,53,0.08)",
    },
    // Accent — cold steel cyan
    cyan: {
      400: "#26c6da",
      500: "#00bcd4",
      glow: "rgba(0,188,212,0.25)",
      subtle: "rgba(0,188,212,0.07)",
    },
    // Neutrals
    grey: {
      900: "#0a0b0d",
      800: "#141618",
      700: "#1e2126",
      600: "#272c33",
      500: "#3a4149",
      400: "#5a636e",
      300: "#8a95a0",
      200: "#b0bbc5",
      100: "#d0d8e0",
      50: "#eef1f4",
    },
    // Status
    green: { 400: "#4caf50", glow: "rgba(76,175,80,0.25)" },
    amber: { 400: "#ffc107", glow: "rgba(255,193,7,0.25)" },
    white: "#f0f4f8",
  },

  fonts: {
    display: "'Orbitron', 'Share Tech Mono', monospace",
    heading: "'Rajdhani', 'Barlow Condensed', sans-serif",
    body: "'Barlow', 'IBM Plex Sans', sans-serif",
    mono: "'Share Tech Mono', 'Courier New', monospace",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "40px",
    "2xl": "64px",
    "3xl": "96px",
    "4xl": "128px",
  },

  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  shadows: {
    redGlow: "0 0 20px rgba(229,57,53,0.4), 0 0 60px rgba(229,57,53,0.15)",
    cyanGlow: "0 0 20px rgba(0,188,212,0.4), 0 0 60px rgba(0,188,212,0.15)",
    card: "0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03) inset",
    cardHover: "0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(229,57,53,0.2)",
  },

  animation: {
    fast: "150ms",
    base: "250ms",
    slow: "400ms",
    xslow: "600ms",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

// CSS variable injection — call once in root
export const cssVariables = `
  :root {
    --bg-primary: ${theme.colors.bg.primary};
    --bg-secondary: ${theme.colors.bg.secondary};
    --bg-card: ${theme.colors.bg.card};
    --red-400: ${theme.colors.red[400]};
    --red-500: ${theme.colors.red[500]};
    --red-600: ${theme.colors.red[600]};
    --red-glow: ${theme.colors.red.glow};
    --red-subtle: ${theme.colors.red.subtle};
    --cyan-400: ${theme.colors.cyan[400]};
    --cyan-500: ${theme.colors.cyan[500]};
    --cyan-glow: ${theme.colors.cyan.glow};
    --grey-700: ${theme.colors.grey[700]};
    --grey-600: ${theme.colors.grey[600]};
    --grey-400: ${theme.colors.grey[400]};
    --grey-300: ${theme.colors.grey[300]};
    --grey-200: ${theme.colors.grey[200]};
    --white: ${theme.colors.white};
    --font-display: ${theme.fonts.display};
    --font-heading: ${theme.fonts.heading};
    --font-body: ${theme.fonts.body};
    --font-mono: ${theme.fonts.mono};
    --shadow-red: ${theme.shadows.redGlow};
    --shadow-cyan: ${theme.shadows.cyanGlow};
    --shadow-card: ${theme.shadows.card};
  }
`;

export default theme;
