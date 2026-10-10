"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Menu } from "lucide-react";

import { MAIN_CONTENT_ID } from "@/components/layout/SkipLink";
import { useUiStore } from "@/stores/use-ui-store";
import { designTokens } from "@/theme/tokens";

import { AppShellSidebar } from "./AppShellSidebar";
import type { AppShellProps } from "./types";

export type { AppShellNavigationItem, AppShellProps } from "./types";

export function AppShell({
  actions,
  brand,
  children,
  contextLabel = "Workspace",
  navigation,
  sidebarFooter,
}: AppShellProps) {
  const closeSidebar = useUiStore((state) => state.closeSidebar);
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const drawerWidth = designTokens.layout.sidebarWidth;

  return (
    <Box sx={{ bgcolor: "background.default", display: "flex", minHeight: "100dvh" }}>
      <AppBar
        color="inherit"
        elevation={0}
        position="fixed"
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          color: "text.primary",
          ml: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar
          sx={{
            gap: 3,
            minHeight: `${designTokens.layout.headerHeight}px !important`,
            px: { xs: 4, sm: 6, lg: 8 },
          }}
        >
          <IconButton
            aria-label="Open navigation"
            edge="start"
            onClick={toggleSidebar}
            sx={{ display: { md: "none" } }}
          >
            <Menu aria-hidden="true" size={20} strokeWidth={1.8} />
          </IconButton>
          <Typography
            color="text.secondary"
            sx={{ flexGrow: 1, fontWeight: "fontWeightMedium" }}
            variant="body2"
          >
            {contextLabel}
          </Typography>
          {actions}
        </Toolbar>
      </AppBar>

      <Box component="aside" sx={{ flexShrink: { md: 0 }, width: { md: drawerWidth } }}>
        <Drawer
          ModalProps={{ keepMounted: true }}
          onClose={closeSidebar}
          open={isSidebarOpen}
          sx={{ display: { md: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
          variant="temporary"
        >
          <AppShellSidebar
            brand={brand}
            navigation={navigation}
            onNavigate={closeSidebar}
            sidebarFooter={sidebarFooter}
          />
        </Drawer>
        <Drawer
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { borderRightColor: "divider", width: drawerWidth },
          }}
          variant="permanent"
        >
          <AppShellSidebar brand={brand} navigation={navigation} sidebarFooter={sidebarFooter} />
        </Drawer>
      </Box>

      <Box
        component="main"
        id={MAIN_CONTENT_ID}
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pt: `${designTokens.layout.headerHeight}px`,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
