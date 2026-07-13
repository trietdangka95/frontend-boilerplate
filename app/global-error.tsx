"use client";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            alignItems: "center",
            background: "#f8fafc",
            color: "#0f172a",
            display: "flex",
            fontFamily:
              '"Avenir Next", "Segoe UI Variable", "Segoe UI", ui-sans-serif, system-ui, -apple-system, sans-serif',
            justifyContent: "center",
            minHeight: "100dvh",
            padding: "48px 24px",
          }}
        >
          <section
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              maxWidth: 560,
              padding: 24,
              width: "100%",
            }}
          >
            <p style={{ color: "#0d766e", fontSize: 14, fontWeight: 700, margin: "0 0 8px" }}>
              Application error
            </p>
            <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: "0 0 12px" }}>
              The app needs a quick reset
            </h1>
            <p style={{ color: "#475569", fontSize: 16, lineHeight: 1.6, margin: "0 0 20px" }}>
              A global boundary caught an unexpected failure before the route could render.
            </p>
            {error.digest ? (
              <p style={{ color: "#64748b", fontFamily: "monospace", fontSize: 12 }}>
                Error digest: {error.digest}
              </p>
            ) : null}
            <button
              onClick={reset}
              style={{
                background: "#0d766e",
                border: 0,
                borderRadius: 10,
                color: "#ffffff",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
                minHeight: 40,
                padding: "8px 16px",
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
