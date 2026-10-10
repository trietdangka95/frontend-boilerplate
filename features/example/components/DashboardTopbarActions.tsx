"use client";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Bell } from "lucide-react";

import { ColorModeToggle } from "@/components/ui/ColorModeToggle/ColorModeToggle";
import { useLogout } from "@/features/auth/hooks/use-auth";

export function DashboardTopbarActions({ showDemoAuth = false }: { showDemoAuth?: boolean }) {
  const logout = useLogout();

  return (
    <>
      <ColorModeToggle />
      <Tooltip title="Notifications">
        <IconButton aria-label="Notifications">
          <Badge color="primary" variant="dot">
            <Bell aria-hidden="true" size={19} strokeWidth={1.8} />
          </Badge>
        </IconButton>
      </Tooltip>
      {showDemoAuth ? (
        <Tooltip title="Log out">
          <span>
            <IconButton
              aria-label="MT — Log out"
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
              sx={{ p: 0 }}
            >
              <Avatar
                alt="Minh Tran"
                sx={{
                  bgcolor: "secondary.main",
                  fontSize: 13,
                  fontWeight: "fontWeightBold",
                  height: 34,
                  width: 34,
                }}
              >
                MT
              </Avatar>
            </IconButton>
          </span>
        </Tooltip>
      ) : null}
    </>
  );
}
