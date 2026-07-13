"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { useUiStore } from "@/stores/use-ui-store";
import { designTokens } from "@/theme/tokens";

export interface AppShellNavigationItem {
  active?: boolean;
  href: string;
  icon?: ReactNode;
  label: string;
  trailing?: ReactNode;
}

export interface AppShellProps {
  actions?: ReactNode;
  brand: string;
  children: ReactNode;
  contextLabel?: string;
  navigation: AppShellNavigationItem[];
  sidebarFooter?: ReactNode;
}

function Navigation({
  items,
  onNavigate,
}: {
  items: AppShellNavigationItem[];
  onNavigate?: () => void;
}) {
  return (
    <Box aria-label="Primary navigation" component="nav" sx={{ px: 3, py: 4 }}>
      <List disablePadding sx={{ display: "grid", gap: 1 }}>
        {items.map((item) => (
          <ListItemButton
            aria-current={item.active ? "page" : undefined}
            component={Link}
            href={item.href}
            key={item.href}
            onClick={onNavigate}
            selected={item.active}
            sx={{
              borderRadius: 2.5,
              minHeight: 44,
              px: 3,
              "&.Mui-selected": {
                color: "primary.dark",
                "& .MuiListItemIcon-root": { color: "primary.main" },
              },
            }}
          >
            {item.icon ? (
              <ListItemIcon sx={{ color: "text.secondary", minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
            ) : null}
            <ListItemText
              primary={item.label}
              slotProps={{ primary: { sx: { fontSize: 14, fontWeight: item.active ? 700 : 550 } } }}
            />
            {item.trailing}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

function SidebarContent({
  brand,
  navigation,
  onNavigate,
  sidebarFooter,
}: Pick<AppShellProps, "brand" | "navigation" | "sidebarFooter"> & { onNavigate?: () => void }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ alignItems: "center", display: "flex", gap: 3, minHeight: 72, px: 4 }}>
        <Box
          aria-hidden="true"
          sx={{
            alignItems: "center",
            bgcolor: "primary.main",
            borderRadius: 2.5,
            color: "primary.contrastText",
            display: "flex",
            fontSize: 13,
            fontWeight: 800,
            height: 34,
            justifyContent: "center",
            letterSpacing: "-0.03em",
            width: 34,
          }}
        >
          NS
        </Box>
        <Typography component="span" variant="subtitle1">
          {brand}
        </Typography>
        {onNavigate ? (
          <IconButton aria-label="Close navigation" onClick={onNavigate} sx={{ ml: "auto" }}>
            <X aria-hidden="true" size={20} strokeWidth={1.8} />
          </IconButton>
        ) : null}
      </Box>
      <Divider />
      <Navigation items={navigation} onNavigate={onNavigate} />
      {sidebarFooter ? (
        <Box sx={{ borderTop: 1, borderColor: "divider", mt: "auto", p: 4 }}>{sidebarFooter}</Box>
      ) : null}
    </Box>
  );
}

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
          bgcolor: "rgba(255, 255, 255, 0.88)",
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
          <Typography color="text.secondary" sx={{ flexGrow: 1, fontWeight: 600 }} variant="body2">
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
          <SidebarContent
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
          <SidebarContent brand={brand} navigation={navigation} sidebarFooter={sidebarFooter} />
        </Drawer>
      </Box>

      <Box
        component="main"
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
