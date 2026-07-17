import { createTheme } from "@mui/material/styles";

import { designTokens } from "./tokens";

const { brand, neutral, darkNeutral } = designTokens.color;

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1024,
      xl: 1440,
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          alignItems: "center",
          borderRadius: designTokens.radius.md,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: designTokens.radius.md,
          fontWeight: 650,
          minHeight: 40,
          paddingInline: 16,
          textTransform: "none",
          transition: `background-color ${designTokens.motion.durationFast} ${designTokens.motion.easing}, border-color ${designTokens.motion.durationFast} ${designTokens.motion.easing}, color ${designTokens.motion.durationFast} ${designTokens.motion.easing}, transform ${designTokens.motion.durationFast} ${designTokens.motion.easing}`,
          "&:active": {
            transform: "translateY(1px) scale(0.99)",
          },
          "&:focus-visible": {
            boxShadow: designTokens.shadow.focus,
            outline: "none",
          },
        },
        sizeLarge: {
          minHeight: 48,
          paddingInline: 20,
        },
        sizeSmall: {
          minHeight: 34,
          paddingInline: 12,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.radius.sm,
          "&:focus-visible": {
            boxShadow: designTokens.shadow.focus,
          },
        },
      },
    },
    MuiChip: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          borderRadius: designTokens.radius.full,
          fontSize: "0.75rem",
          fontWeight: 650,
          height: 26,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: `1px solid ${neutral[200]}`,
          borderRadius: designTokens.radius.lg,
          boxShadow: designTokens.shadow.raised,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.radius.md,
          transition: `background-color ${designTokens.motion.durationFast} ${designTokens.motion.easing}, transform ${designTokens.motion.durationFast} ${designTokens.motion.easing}`,
          "&:active": {
            transform: "scale(0.96)",
          },
          "&:focus-visible": {
            boxShadow: designTokens.shadow.focus,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 550,
          "&.MuiInputLabel-outlined.MuiInputLabel-shrink": {
            backgroundColor: neutral[0],
            paddingInline: 4,
            transform: "translate(11px, -9px) scale(0.75)",
          },
          "&.MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
            transform: "translate(14px, 11px) scale(1)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.radius.md,
          backgroundColor: neutral[0],
          transition: `box-shadow ${designTokens.motion.durationFast} ${designTokens.motion.easing}`,
          "&.Mui-focused": {
            boxShadow: designTokens.shadow.focus,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
          },
        },
        input: {
          paddingBlock: 11.5,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        rounded: {
          borderRadius: designTokens.radius.lg,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: neutral[600],
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        },
        root: {
          borderColor: neutral[200],
          padding: "14px 16px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: `background-color ${designTokens.motion.durationFast} ${designTokens.motion.easing}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: designTokens.radius.sm,
          fontSize: "0.75rem",
          padding: "6px 10px",
        },
      },
    },
  },
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        action: {
          active: neutral[600],
          hover: "rgba(15, 23, 42, 0.05)",
          selected: "rgba(13, 118, 110, 0.10)",
        },
        background: {
          default: neutral[50],
          paper: neutral[0],
        },
        divider: neutral[200],
        error: {
          main: "#b42318",
        },
        info: {
          main: "#2563a8",
        },
        primary: {
          contrastText: neutral[0],
          dark: brand[700],
          light: brand[100],
          main: brand[600],
        },
        secondary: {
          contrastText: neutral[0],
          dark: neutral[900],
          light: neutral[600],
          main: neutral[800],
        },
        success: {
          main: "#287a4b",
        },
        text: {
          primary: neutral[900],
          secondary: neutral[600],
        },
        warning: {
          main: "#a15c07",
        },
      },
    },
    dark: {
      palette: {
        action: {
          active: darkNeutral[600],
          hover: "rgba(255, 255, 255, 0.05)",
          selected: "rgba(13, 118, 110, 0.20)",
        },
        background: {
          default: darkNeutral[50],
          paper: darkNeutral[0],
        },
        divider: darkNeutral[200],
        error: {
          main: "#f04438",
        },
        info: {
          main: "#53b1fd",
        },
        primary: {
          contrastText: darkNeutral[950],
          dark: brand[500],
          light: brand[800],
          main: brand[400],
        },
        secondary: {
          contrastText: darkNeutral[950],
          dark: darkNeutral[100],
          light: darkNeutral[400],
          main: darkNeutral[200],
        },
        success: {
          main: "#32d583",
        },
        text: {
          primary: darkNeutral[900],
          secondary: darkNeutral[600],
        },
        warning: {
          main: "#fec84b",
        },
      },
    },
  },
  shape: {
    borderRadius: designTokens.radius.md,
  },
  spacing: 4,
  typography: {
    body1: {
      fontSize: "1rem",
      lineHeight: 1.65,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.55,
    },
    button: {
      fontWeight: 650,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
    },
    fontFamily:
      '"Avenir Next", "Segoe UI Variable", "Segoe UI", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeightBold: 700,
    fontWeightMedium: 600,
    fontWeightRegular: 450,
    h1: {
      fontSize: "clamp(2.25rem, 5vw, 4rem)",
      fontWeight: 700,
      letterSpacing: "-0.045em",
      lineHeight: 1.04,
    },
    h2: {
      fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
      fontWeight: 700,
      letterSpacing: "-0.035em",
      lineHeight: 1.12,
    },
    h3: {
      fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
      fontWeight: 650,
      letterSpacing: "-0.025em",
      lineHeight: 1.25,
    },
    h4: {
      fontSize: "1.125rem",
      fontWeight: 650,
      letterSpacing: "-0.015em",
      lineHeight: 1.35,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 650,
      lineHeight: 1.45,
    },
  },
});
