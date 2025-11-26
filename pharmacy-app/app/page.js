import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center px-4 py-12">
      {/* Hero */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-start gap-10 md:flex-row md:items-center">
        <div className="flex-1 space-y-5">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Prototype · Community Pharmacy Web App
          </span>

          <h1 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            Order medicines safely from your{" "}
            <span className="text-blue-700">local community pharmacies</span>
          </h1>

          <p className="text-sm leading-relaxed text-slate-600 md:text-base">
            This application lets patients browse common medicines, see which
            pharmacies stock them, and place click-and-collect orders. Community
            pharmacists can manage their stock in one place and keep
            availability information up to date.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/browse"
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Browse medicines
            </Link>
            <Link
              href="/pharmacies"
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:border-blue-500 hover:text-blue-600"
            >
              Find a pharmacy
            </Link>
          </div>

          <div className="mt-4 grid gap-3 text-xs text-slate-500 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
              <p>
                <span className="font-semibold text-slate-700">
                  Patients:
                </span>{" "}
                Search products, view availability, build a cart, and place
                orders linked to your account.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-indigo-500" />
              <p>
                <span className="font-semibold text-slate-700">
                  Pharmacists:
                </span>{" "}
                Log in as an admin to manage pharmacies, products, and review
                incoming orders.
              </p>
            </div>
          </div>
        </div>

        {/* Optional illustration (replace src with an image in /public if you add one) */}
        <div className="hidden flex-1 md:flex md:justify-end">
          <div className="relative h-56 w-full max-w-sm">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50 to-slate-50 shadow-inner" />
            <div className="relative flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                  Live overview
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Today&apos;s pharmacy activity
                </p>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Active pharmacies</span>
                  <span className="font-semibold text-slate-900">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Products in catalogue</span>
                  <span className="font-semibold text-slate-900">120+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Orders placed today</span>
                  <span className="font-semibold text-slate-900">3</span>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Data shown here is for demonstration purposes as part of a
                coursework project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto mt-12 w-full max-w-5xl">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              1. Discover
            </p>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              Browse by product or pharmacy
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              Use the <span className="font-medium">Browse</span> and{" "}
              <span className="font-medium">Pharmacies</span> pages to explore
              medicines, compare prices, and see which community pharmacies
              currently list each item.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              2. Plan
            </p>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              Build a cart and place an order
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              Add items from one or more pharmacies to your cart, review
              quantities, and confirm your order. Orders are stored in Firestore
              and visible on the <span className="font-medium">My Orders</span>{" "}
              page.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              3. Manage
            </p>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              Admin tools for pharmacies
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              Admin users can access the{" "}
              <span className="font-medium">Admin</span> area to create and edit
              pharmacies, manage product stock and pricing, and monitor order
              activity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
