const brand = {
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
} as const;

const neutral = {
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
} as const;

const darkNeutral = {
  0: "#0b1120",
  50: "#0f172a",
  100: "#1e293b",
  200: "#334155",
  300: "#475569",
  400: "#64748b",
  500: "#94a3b8",
  600: "#cbd5e1",
  700: "#e2e8f0",
  800: "#f1f5f9",
  900: "#f8fafc",
  950: "#ffffff",
} as const;

const semantic = {
  light: {
    action: {
      active: neutral[600],
      hover: "rgba(15, 23, 42, 0.05)",
      selected: "rgba(13, 118, 110, 0.10)",
    },
    background: {
      canvas: neutral[50],
      surface: neutral[0],
    },
    border: neutral[200],
    error: "#b42318",
    info: "#2563a8",
    primary: {
      contrast: neutral[0],
      dark: brand[700],
      light: brand[100],
      main: brand[600],
    },
    secondary: {
      contrast: neutral[0],
      dark: neutral[900],
      light: neutral[600],
      main: neutral[800],
    },
    success: "#287a4b",
    text: {
      primary: neutral[900],
      secondary: neutral[600],
    },
    warning: "#a15c07",
  },
  dark: {
    action: {
      active: darkNeutral[600],
      hover: "rgba(255, 255, 255, 0.05)",
      selected: "rgba(13, 118, 110, 0.20)",
    },
    background: {
      canvas: darkNeutral[50],
      surface: darkNeutral[0],
    },
    border: darkNeutral[200],
    error: "#f04438",
    info: "#53b1fd",
    primary: {
      contrast: darkNeutral[0],
      dark: brand[500],
      light: brand[800],
      main: brand[400],
    },
    secondary: {
      contrast: darkNeutral[0],
      dark: darkNeutral[600],
      light: darkNeutral[900],
      main: darkNeutral[700],
    },
    success: "#32d583",
    text: {
      primary: darkNeutral[900],
      secondary: darkNeutral[600],
    },
    warning: "#fec84b",
  },
} as const;

const spacingUnit = 4;

export const designTokens = {
  color: {
    brand,
    darkNeutral,
    neutral,
    semantic,
  },
  layout: {
    authContentMaxWidth: 440,
    contentMaxWidth: 1280,
    headerHeight: 72,
    narrowContentMaxWidth: 560,
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
    focus: "0 0 0 3px rgba(var(--mui-palette-primary-mainChannel) / 0.18)",
    raised: "0 16px 40px -24px rgba(var(--mui-palette-text-primaryChannel) / 0.28)",
  },
  space: {
    unit: spacingUnit,
    xs: spacingUnit,
    sm: spacingUnit * 2,
    md: spacingUnit * 3,
    lg: spacingUnit * 4,
    xl: spacingUnit * 6,
    "2xl": spacingUnit * 8,
    "3xl": spacingUnit * 12,
    "4xl": spacingUnit * 16,
  },
  typography: {
    fontFamily:
      '"Avenir Next", "Segoe UI Variable", "Segoe UI", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: {
      regular: 450,
      medium: 600,
      semibold: 650,
      bold: 700,
    },
  },
} as const;

const toPixels = (value: number) => `${value}px`;

export interface AppThemeTokens {
  layout: {
    contentMaxWidth: string;
    headerHeight: string;
    sidebarWidth: string;
  };
  motion: {
    durationFast: string;
    durationStandard: string;
    easing: string;
  };
  radius: {
    full: string;
    lg: string;
    md: string;
    sm: string;
    xl: string;
  };
  shadow: {
    focus: string;
    raised: string;
  };
  typography: {
    fontFamily: string;
    fontWeightBold: string;
    fontWeightMedium: string;
    fontWeightRegular: string;
    fontWeightSemibold: string;
  };
}

export const appThemeTokens = {
  layout: {
    contentMaxWidth: toPixels(designTokens.layout.contentMaxWidth),
    headerHeight: toPixels(designTokens.layout.headerHeight),
    sidebarWidth: toPixels(designTokens.layout.sidebarWidth),
  },
  motion: designTokens.motion,
  radius: {
    full: toPixels(designTokens.radius.full),
    lg: toPixels(designTokens.radius.lg),
    md: toPixels(designTokens.radius.md),
    sm: toPixels(designTokens.radius.sm),
    xl: toPixels(designTokens.radius.xl),
  },
  shadow: designTokens.shadow,
  typography: {
    fontFamily: designTokens.typography.fontFamily,
    fontWeightBold: String(designTokens.typography.fontWeight.bold),
    fontWeightMedium: String(designTokens.typography.fontWeight.medium),
    fontWeightRegular: String(designTokens.typography.fontWeight.regular),
    fontWeightSemibold: String(designTokens.typography.fontWeight.semibold),
  },
} as const satisfies AppThemeTokens;

export type StatusTone = "error" | "info" | "neutral" | "success" | "warning";
