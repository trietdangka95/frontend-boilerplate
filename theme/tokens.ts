export const designTokens = {
  color: {
    brand: {
      50: "#edf8f6",
      100: "#d2eee9",
      200: "#a6ddd4",
      300: "#71c4b9",
      400: "#3ea69d",
      500: "#218a82",
      600: "#0d766e",
      700: "#0f5e59",
      800: "#104b48",
      900: "#103f3d",
      950: "#082524",
    },
    neutral: {
      0: "#ffffff",
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#0b1120",
    },
  },
  layout: {
    contentMaxWidth: 1280,
    headerHeight: 72,
    sidebarWidth: 272,
  },
  motion: {
    durationFast: "150ms",
    durationStandard: "240ms",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    full: 999,
  },
  shadow: {
    focus: "0 0 0 3px rgba(13, 118, 110, 0.18)",
    raised: "0 16px 40px -24px rgba(15, 23, 42, 0.28)",
  },
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
    "3xl": 48,
    "4xl": 64,
  },
} as const;

export type StatusTone = "error" | "info" | "neutral" | "success" | "warning";
