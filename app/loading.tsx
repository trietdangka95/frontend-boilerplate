export default function LoadingPage() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading page"
      className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 sm:px-10"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="space-y-4">
          <div className="h-10 w-full max-w-2xl animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full max-w-lg animate-pulse rounded bg-slate-200" />
        </div>
        <div className="h-10 w-44 animate-pulse rounded bg-slate-200" />
      </div>
    </main>
  );
}
