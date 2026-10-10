import type {} from "@mui/material/themeCssVarsAugmentation";

import type { AppThemeTokens } from "./tokens";

declare module "@mui/material/styles" {
  interface Theme {
    app: AppThemeTokens;
  }

  interface ThemeOptions {
    app?: AppThemeTokens;
  }

  interface ThemeVars {
    app: AppThemeTokens;
  }
}
