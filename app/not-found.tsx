import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-950">
      <section className="w-full max-w-xl rounded-md border border-slate-200 bg-white p-6">
        <p className="mb-2 text-sm font-semibold text-blue-700">404</p>
        <h1 className="mb-3 text-3xl font-semibold tracking-normal">Page not found</h1>
        <p className="mb-6 leading-7 text-slate-600">
          The route does not exist in this boilerplate. Return home to continue building from a
          known state.
        </p>
        <Link
          className="inline-flex min-h-10 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
          href="/"
        >
          Back home
        </Link>
      </section>
    </main>
  );
}
