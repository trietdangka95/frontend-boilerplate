import Link from "next/link";

import { MAIN_CONTENT_ID } from "@/components/layout/SkipLink";
import { ColorModeToggle } from "@/components/ui/ColorModeToggle/ColorModeToggle";

export default function HomePage() {
  return (
    <main
      id={MAIN_CONTENT_ID}
      className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-center gap-8 px-6 py-12"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-brand">Frontend starter</p>
        <ColorModeToggle />
      </div>
      <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
        A foundation for your next application.
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-muted">
        Start with a consistent design system, accessible components, and tested data patterns. Make
        it your own.
      </p>
      <Link
        className="w-fit rounded-md border border-default bg-surface px-6 py-3 font-medium text-brand hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        href="/examples"
      >
        Explore examples
      </Link>
    </main>
  );
}
