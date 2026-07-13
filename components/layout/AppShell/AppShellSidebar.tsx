import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { X } from "lucide-react";
import Link from "next/link";

import type { AppShellNavigationItem, AppShellProps } from "./types";

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

export function AppShellSidebar({
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
