export default function LoadingPage() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading page"
      className="min-h-[100dvh] bg-slate-50 text-slate-950"
    >
      <div className="hidden h-[100dvh] w-[272px] border-r border-slate-200 bg-white md:fixed md:block">
        <div className="h-[72px] border-b border-slate-200 p-5">
          <div className="h-8 w-36 animate-pulse rounded-lg bg-slate-200" />
        </div>
        <div className="grid gap-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" key={index} />
          ))}
        </div>
      </div>
      <div className="border-b border-slate-200 bg-white md:ml-[272px]">
        <div className="h-[72px] p-5">
          <div className="h-7 w-44 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
      <div className="md:ml-[272px]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="h-4 w-44 animate-pulse rounded bg-teal-100" />
          <div className="space-y-4">
            <div className="h-12 w-full max-w-2xl animate-pulse rounded-lg bg-slate-200" />
            <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full max-w-lg animate-pulse rounded bg-slate-200" />
          </div>
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="h-32 animate-pulse border-slate-200 bg-slate-50 p-5" key={index} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
