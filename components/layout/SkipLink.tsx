export const MAIN_CONTENT_ID = "main-content";

export function SkipLink() {
  return (
    <a
      className="fixed left-4 top-0 z-50 -translate-y-full rounded-md bg-surface px-4 py-2 text-foreground shadow-raised focus:translate-y-4 focus:outline-2 focus:outline-offset-2 focus:outline-brand"
      href={`#${MAIN_CONTENT_ID}`}
    >
      Skip to main content
    </a>
  );
}
