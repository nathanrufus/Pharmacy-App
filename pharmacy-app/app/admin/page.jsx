export default function AdminDashboardPage() {
  // Later we’ll pull real stats from Firestore (counts of pharmacies, products, orders)
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage pharmacies, products, and orders on the platform.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Pharmacies
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">—</p>
          <p className="mt-1 text-xs text-slate-500">
            Total registered pharmacies
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Products
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">—</p>
          <p className="mt-1 text-xs text-slate-500">
            Products in the shared catalogue
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Orders
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">—</p>
          <p className="mt-1 text-xs text-slate-500">
            Orders placed across all pharmacies
          </p>
        </div>
      </div>
    </div>
  );
}
