export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
          somomaan.com
        </p>

        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
          Welcome to Somomaan Portal
        </h1>

        <p className="mb-8 text-lg text-slate-600">
          Clean new project structure with public pages, auth pages, and admin
          dashboard separated properly.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">Project foundation ready</h2>
          <p className="text-slate-600">
            Next step is building apply flow, login flow, and admin dashboard pages.
          </p>
        </div>
      </div>
    </main>
  );
}