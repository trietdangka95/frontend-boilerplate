import { createTheme } from "@mui/material/styles";

import { appThemeTokens, designTokens } from "./tokens";

const { dark: darkColors, light: lightColors } = designTokens.color.semantic;

export const theme = createTheme({
  app: appThemeTokens,
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
        root: ({ theme }) => ({
          alignItems: "center",
          borderRadius: theme.vars.app.radius.md,
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.vars.app.radius.md,
          fontWeight: designTokens.typography.fontWeight.semibold,
          minHeight: theme.spacing(10),
          paddingInline: theme.spacing(4),
          textTransform: "none",
          transition: `background-color ${theme.vars.app.motion.durationFast} ${theme.vars.app.motion.easing}, border-color ${theme.vars.app.motion.durationFast} ${theme.vars.app.motion.easing}, color ${theme.vars.app.motion.durationFast} ${theme.vars.app.motion.easing}, transform ${theme.vars.app.motion.durationFast} ${theme.vars.app.motion.easing}`,
          "&:active": {
            transform: "translateY(1px) scale(0.99)",
          },
          "&:focus-visible": {
            boxShadow: theme.vars.app.shadow.focus,
            outline: "none",
          },
        }),
        sizeLarge: ({ theme }) => ({
          minHeight: theme.spacing(12),
          paddingInline: theme.spacing(5),
        }),
        sizeSmall: ({ theme }) => ({
          minHeight: theme.spacing(8.5),
          paddingInline: theme.spacing(3),
        }),
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.vars.app.radius.sm,
          "&:focus-visible": {
            boxShadow: theme.vars.app.shadow.focus,
          },
        }),
      },
    },
    MuiChip: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.vars.app.radius.full,
          fontSize: "0.75rem",
          fontWeight: designTokens.typography.fontWeight.semibold,
          height: theme.spacing(6.5),
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          border: `1px solid ${theme.vars.palette.divider}`,
          borderRadius: theme.vars.app.radius.lg,
          boxShadow: theme.vars.app.shadow.raised,
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.vars.app.radius.md,
          transition: `background-color ${theme.vars.app.motion.durationFast} ${theme.vars.app.motion.easing}, transform ${theme.vars.app.motion.durationFast} ${theme.vars.app.motion.easing}`,
          "&:active": {
            transform: "scale(0.96)",
          },
          "&:focus-visible": {
            boxShadow: theme.vars.app.shadow.focus,
          },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: designTokens.typography.fontWeight.medium,
          "&.MuiInputLabel-outlined.MuiInputLabel-shrink": {
            backgroundColor: theme.vars.palette.background.paper,
            paddingInline: theme.spacing(1),
            transform: "translate(11px, -9px) scale(0.75)",
          },
          "&.MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
            transform: "translate(14px, 11px) scale(1)",
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.vars.app.radius.md,
          backgroundColor: theme.vars.palette.background.paper,
          transition: `box-shadow ${theme.vars.app.motion.durationFast} ${theme.vars.app.motion.easing}`,
          "&.Mui-focused": {
            boxShadow: theme.vars.app.shadow.focus,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
          },
        }),
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
        rounded: ({ theme }) => ({
          borderRadius: theme.vars.app.radius.lg,
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          color: theme.vars.palette.text.secondary,
          fontSize: "0.75rem",
          fontWeight: designTokens.typography.fontWeight.bold,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }),
        root: ({ theme }) => ({
          borderColor: theme.vars.palette.divider,
          padding: theme.spacing(3.5, 4),
        }),
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: `background-color ${theme.vars.app.motion.durationFast} ${theme.vars.app.motion.easing}`,
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          borderRadius: theme.vars.app.radius.sm,
          fontSize: "0.75rem",
          padding: theme.spacing(1.5, 2.5),
        }),
      },
    },
  },
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        action: lightColors.action,
        background: {
          default: lightColors.background.canvas,
          paper: lightColors.background.surface,
        },
        divider: lightColors.border,
        error: {
          main: lightColors.error,
        },
        info: {
          main: lightColors.info,
        },
        primary: {
          contrastText: lightColors.primary.contrast,
          dark: lightColors.primary.dark,
          light: lightColors.primary.light,
          main: lightColors.primary.main,
        },
        secondary: {
          contrastText: lightColors.secondary.contrast,
          dark: lightColors.secondary.dark,
          light: lightColors.secondary.light,
          main: lightColors.secondary.main,
        },
        success: {
          main: lightColors.success,
        },
        text: lightColors.text,
        warning: {
          main: lightColors.warning,
        },
      },
    },
    dark: {
      palette: {
        action: darkColors.action,
        background: {
          default: darkColors.background.canvas,
          paper: darkColors.background.surface,
        },
        divider: darkColors.border,
        error: {
          main: darkColors.error,
        },
        info: {
          main: darkColors.info,
        },
        primary: {
          contrastText: darkColors.primary.contrast,
          dark: darkColors.primary.dark,
          light: darkColors.primary.light,
          main: darkColors.primary.main,
        },
        secondary: {
          contrastText: darkColors.secondary.contrast,
          dark: darkColors.secondary.dark,
          light: darkColors.secondary.light,
          main: darkColors.secondary.main,
        },
        success: {
          main: darkColors.success,
        },
        text: darkColors.text,
        warning: {
          main: darkColors.warning,
        },
      },
    },
  },
  shape: {
    borderRadius: designTokens.radius.md,
  },
  spacing: designTokens.space.unit,
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
      fontWeight: designTokens.typography.fontWeight.semibold,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
    },
    fontFamily: designTokens.typography.fontFamily,
    fontWeightBold: designTokens.typography.fontWeight.bold,
    fontWeightMedium: designTokens.typography.fontWeight.medium,
    fontWeightRegular: designTokens.typography.fontWeight.regular,
    h1: {
      fontSize: "clamp(2.25rem, 5vw, 4rem)",
      fontWeight: designTokens.typography.fontWeight.bold,
      letterSpacing: "-0.045em",
      lineHeight: 1.04,
    },
    h2: {
      fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
      fontWeight: designTokens.typography.fontWeight.bold,
      letterSpacing: "-0.035em",
      lineHeight: 1.12,
    },
    h3: {
      fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
      fontWeight: designTokens.typography.fontWeight.semibold,
      letterSpacing: "-0.025em",
      lineHeight: 1.25,
    },
    h4: {
      fontSize: "1.125rem",
      fontWeight: designTokens.typography.fontWeight.semibold,
      letterSpacing: "-0.015em",
      lineHeight: 1.35,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: 1.45,
    },
  },
});
