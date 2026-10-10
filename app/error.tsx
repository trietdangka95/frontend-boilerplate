"use client";

import { useEffect } from "react";
import { reportError } from "@/services/observability/report-error";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/ui/Button";
import { MAIN_CONTENT_ID } from "@/components/layout/SkipLink";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => reportError(error, "route-boundary"), [error]);
  return (
    <main
      className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-12 text-foreground sm:px-6"
      id={MAIN_CONTENT_ID}
    >
      <Paper
        className="flex w-full max-w-xl flex-col items-start gap-6 p-6 sm:p-8"
        component="section"
        variant="outlined"
      >
        <div className="space-y-2">
          <Typography color="primary.main" sx={{ fontWeight: "fontWeightBold" }} variant="body2">
            Recoverable route error
          </Typography>
          <Typography component="h1" variant="h2">
            Something went wrong
          </Typography>
          <Typography className="text-muted" variant="body1">
            The current route hit a recoverable error. Try again, or return to a stable page.
          </Typography>
          {error.digest ? (
            <Typography className="font-mono text-xs text-muted" variant="caption">
              Error digest: {error.digest}
            </Typography>
          ) : null}
        </div>

        <Button onClick={reset}>Try again</Button>
      </Paper>
    </main>
  );
}
