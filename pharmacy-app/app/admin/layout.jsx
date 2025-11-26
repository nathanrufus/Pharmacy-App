"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }) {
  const { role, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect non-admins after auth state is known
  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== "admin")) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, role, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Checking permissions…</p>
      </div>
    );
  }

  // We show a simple message briefly while the redirect happens
  if (!isAuthenticated || role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-red-600">
          You are not authorised to view this area.
        </p>
      </div>
    );
  }

  const navLinkClasses = (href) =>
    `block rounded-md px-3 py-2 text-sm font-medium ${
      pathname === href
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="flex min-h-[70vh] gap-6">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Admin
        </h2>
        <nav className="space-y-1">
          <Link href="/admin" className={navLinkClasses("/admin")}>
            Overview
          </Link>
          <Link href="/admin/pharmacies" className={navLinkClasses("/admin/pharmacies")}>
            Pharmacies
          </Link>
          <Link href="/admin/products" className={navLinkClasses("/admin/products")}>
            Products
          </Link>
          {/* <Link href="/admin/orders" className={navLinkClasses("/admin/orders")}>
            Orders
          </Link> */}
        </nav>
      </aside>

      {/* Main content */}
      <section className="flex-1 rounded-2xl bg-white p-6 shadow-sm">
        {children}
      </section>
    </div>
  );
}
