"use client";

import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";
import { Monitor, Moon, Sun } from "lucide-react";

export function ColorModeToggle() {
  const { mode, setMode } = useColorScheme();
  const colorMode = mode ?? "system";

  const handleToggle = () => {
    if (colorMode === "light") setMode("dark");
    else if (colorMode === "dark") setMode("system");
    else setMode("light");
  };

  const getIcon = () => {
    if (colorMode === "light") return <Sun aria-hidden="true" size={20} strokeWidth={1.8} />;
    if (colorMode === "dark") return <Moon aria-hidden="true" size={20} strokeWidth={1.8} />;
    return <Monitor aria-hidden="true" size={20} strokeWidth={1.8} />;
  };

  return (
    <IconButton
      aria-label={`Current mode is ${colorMode}. Click to change.`}
      disabled={mode === undefined}
      onClick={handleToggle}
      sx={{ color: "text.secondary" }}
    >
      {getIcon()}
    </IconButton>
  );
}
