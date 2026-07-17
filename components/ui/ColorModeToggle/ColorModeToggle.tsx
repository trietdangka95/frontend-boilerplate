"use client";

import IconButton from "@mui/material/IconButton";
import { Monitor, Moon, Sun } from "lucide-react";

import { useUiStore } from "@/stores/use-ui-store";

export function ColorModeToggle() {
  const colorMode = useUiStore((state) => state.colorMode);
  const setColorMode = useUiStore((state) => state.setColorMode);

  const handleToggle = () => {
    if (colorMode === "light") setColorMode("dark");
    else if (colorMode === "dark") setColorMode("system");
    else setColorMode("light");
  };

  const getIcon = () => {
    if (colorMode === "light") return <Sun aria-hidden="true" size={20} strokeWidth={1.8} />;
    if (colorMode === "dark") return <Moon aria-hidden="true" size={20} strokeWidth={1.8} />;
    return <Monitor aria-hidden="true" size={20} strokeWidth={1.8} />;
  };

  return (
    <IconButton
      aria-label={`Current mode is ${colorMode}. Click to change.`}
      onClick={handleToggle}
      sx={{ color: "text.secondary" }}
    >
      {getIcon()}
    </IconButton>
  );
}
