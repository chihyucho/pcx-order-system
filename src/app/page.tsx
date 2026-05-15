import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-sky-500 to-indigo-600 text-xs font-bold tracking-tight text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10"
              aria-hidden
            >
              PCX
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">
                PCX Order System
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                B2B order management
              </span>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          >
            Log in
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(14,165,233,0.18),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(56,189,248,0.12),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Order operations, simplified
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Run B2B orders with clarity and control
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Centralize purchase orders, approvals, and fulfillment in one
                workspace built for teams that ship at scale.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Get started
                </Link>
                <a
                  href="#dashboard-preview"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  View preview
                </a>
              </div>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-slate-200 pt-8 dark:border-slate-800">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Uptime
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
                    99.9%
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Regions
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
                    12
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    SOC2
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                    Ready
                  </dd>
                </div>
              </dl>
            </div>

            <div
              id="dashboard-preview"
              className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10"
            >
              <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Dashboard preview
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                      Orders overview
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Live sync
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { label: "Open POs", value: "128", delta: "+6%" },
                    { label: "Shipped", value: "842", delta: "+12%" },
                    { label: "At risk", value: "3", delta: "−1" },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {card.label}
                      </p>
                      <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900 dark:text-white">
                        {card.value}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        {card.delta}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                      <tr>
                        <th className="px-3 py-2 font-medium">Order</th>
                        <th className="hidden px-3 py-2 font-medium sm:table-cell">
                          Customer
                        </th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        {
                          id: "PO-10482",
                          customer: "Northwind Trading",
                          status: "Approved",
                          total: "$48,200",
                          tone: "emerald",
                        },
                        {
                          id: "PO-10479",
                          customer: "Apex Components",
                          status: "In review",
                          total: "$12,640",
                          tone: "amber",
                        },
                        {
                          id: "PO-10476",
                          customer: "Harbor Supply Co.",
                          status: "Shipped",
                          total: "$6,120",
                          tone: "sky",
                        },
                      ].map((row) => (
                        <tr key={row.id}>
                          <td className="px-3 py-2 font-mono text-[11px] font-medium text-slate-800 dark:text-slate-200">
                            {row.id}
                          </td>
                          <td className="hidden px-3 py-2 text-slate-600 dark:text-slate-300 sm:table-cell">
                            {row.customer}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={
                                row.tone === "emerald"
                                  ? "inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-700 dark:text-emerald-400"
                                  : row.tone === "amber"
                                    ? "inline-flex rounded-full bg-amber-500/10 px-2 py-0.5 font-medium text-amber-800 dark:text-amber-300"
                                    : "inline-flex rounded-full bg-sky-500/10 px-2 py-0.5 font-medium text-sky-800 dark:text-sky-300"
                              }
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right font-medium tabular-nums text-slate-800 dark:text-slate-200">
                            {row.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Unified pipeline",
                body: "From quote to invoice, keep every stakeholder aligned with a single source of truth.",
              },
              {
                title: "Role-based access",
                body: "Finance, ops, and partners see exactly what they need—nothing more, nothing less.",
              },
              {
                title: "Audit-ready history",
                body: "Immutable activity logs and exports that stand up to procurement and compliance reviews.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} PCX Order System. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">
                Security
              </a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
