import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  action?: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
}

export function EmptyState({ action, description, icon, title }: EmptyStateProps) {
  return (
    <Stack
      className="items-start rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-6 sm:p-8"
      role="status"
      spacing={3}
    >
      {icon ? (
        <span className="grid size-10 place-items-center rounded-lg bg-teal-50 text-teal-700">
          {icon}
        </span>
      ) : null}
      <Stack spacing={1}>
        <Typography component="h3" variant="h4">
          {title}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
      </Stack>
      {action}
    </Stack>
  );
}
