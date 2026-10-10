"use client";

import { useEffect } from "react";
import { reportError } from "@/services/observability/report-error";

import { designTokens } from "@/theme/tokens";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => reportError(error, "global-boundary"), [error]);
  const colors = designTokens.color.semantic.light;

  return (
    <html lang="en">
      <body>
        <main
          style={{
            alignItems: "center",
            background: colors.background.canvas,
            color: colors.text.primary,
            display: "flex",
            fontFamily: designTokens.typography.fontFamily,
            justifyContent: "center",
            minHeight: "100dvh",
            padding: `${designTokens.space["3xl"]}px ${designTokens.space.xl}px`,
          }}
        >
          <section
            style={{
              background: colors.background.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: designTokens.radius.lg,
              maxWidth: designTokens.layout.narrowContentMaxWidth,
              padding: designTokens.space.xl,
              width: "100%",
            }}
          >
            <p
              style={{
                color: colors.primary.main,
                fontSize: 14,
                fontWeight: designTokens.typography.fontWeight.bold,
                margin: `0 0 ${designTokens.space.sm}px`,
              }}
            >
              Application error
            </p>
            <h1
              style={{
                fontSize: 32,
                lineHeight: 1.2,
                margin: `0 0 ${designTokens.space.md}px`,
              }}
            >
              The app needs a quick reset
            </h1>
            <p
              style={{
                color: colors.text.secondary,
                fontSize: 16,
                lineHeight: 1.6,
                margin: `0 0 ${designTokens.space.xl}px`,
              }}
            >
              A global boundary caught an unexpected failure before the route could render.
            </p>
            {error.digest ? (
              <p style={{ color: colors.text.secondary, fontFamily: "monospace", fontSize: 12 }}>
                Error digest: {error.digest}
              </p>
            ) : null}
            <button
              onClick={reset}
              style={{
                background: colors.primary.main,
                border: 0,
                borderRadius: designTokens.radius.md,
                color: colors.primary.contrast,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: designTokens.typography.fontWeight.bold,
                minHeight: designTokens.space.xs * 10,
                padding: `${designTokens.space.sm}px ${designTokens.space.lg}px`,
              }}
              type="button"
            >
              Reset app
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
