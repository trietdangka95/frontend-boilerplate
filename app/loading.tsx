import { MAIN_CONTENT_ID } from "@/components/layout/SkipLink";

export default function LoadingPage() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading page"
      className="min-h-dvh bg-canvas text-foreground"
      id={MAIN_CONTENT_ID}
    >
      <div className="hidden h-dvh w-sidebar border-r border-default bg-surface md:fixed md:block">
        <div className="h-header border-b border-default p-5">
          <div className="h-8 w-36 animate-pulse rounded-lg bg-skeleton" />
        </div>
        <div className="grid gap-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="h-10 animate-pulse rounded-lg bg-surface-subtle" key={index} />
          ))}
        </div>
      </div>
      <div className="border-b border-default bg-surface md:ml-sidebar">
        <div className="h-header p-5">
          <div className="h-7 w-44 animate-pulse rounded-sm bg-skeleton" />
        </div>
      </div>
      <div className="md:ml-sidebar">
        <div className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="h-4 w-44 animate-pulse rounded-sm bg-brand-subtle" />
          <div className="space-y-4">
            <div className="h-12 w-full max-w-2xl animate-pulse rounded-lg bg-skeleton" />
            <div className="h-4 w-full max-w-xl animate-pulse rounded-sm bg-skeleton" />
            <div className="h-4 w-full max-w-lg animate-pulse rounded-sm bg-skeleton" />
          </div>
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-default bg-surface lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="h-32 animate-pulse border-default bg-canvas p-5" key={index} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
