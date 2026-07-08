"use client";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-950">
      <section className="flex w-full max-w-xl flex-col items-start gap-6 rounded-md border border-slate-200 bg-white p-6">
        <div className="space-y-2">
          <Typography component="h1" variant="h4">
            Something went wrong
          </Typography>
          <Typography className="text-slate-600" variant="body1">
            The current route hit a recoverable error. Try again, or return to a stable page.
          </Typography>
          {error.digest ? (
            <Typography className="font-mono text-xs text-slate-500" variant="caption">
              Error digest: {error.digest}
            </Typography>
          ) : null}
        </div>

        <Button
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          onClick={reset}
          variant="contained"
        >
          Try again
        </Button>
      </section>
    </main>
  );
}
