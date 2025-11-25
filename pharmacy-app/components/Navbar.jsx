"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, isAuthenticated, loading } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const isActive = (href) =>
    pathname === href
      ? "text-blue-600 border-b-2 border-blue-600"
      : "text-slate-600 hover:text-blue-600";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold">
              Rx
            </div>
            <span className="font-semibold text-slate-800">
              Community Pharmacy
            </span>
          </Link>
        </div>

        {/* Main nav */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Public / user routes */}
          <Link href="/browse" className={`text-sm font-medium ${isActive("/browse")}`}>
            Browse
          </Link>
          <Link href="/pharmacies" className={`text-sm font-medium ${isActive("/pharmacies")}`}>
            Pharmacies
          </Link>
          <Link href="/map" className={`text-sm font-medium ${isActive("/map")}`}>
            Map
          </Link>

          {/* User-only */}
          {isAuthenticated && role !== "admin" && (
            <Link href="/orders" className={`text-sm font-medium ${isActive("/orders")}`}>
              My Orders
            </Link>
          )}

          {/* Admin-only */}
          {isAuthenticated && role === "admin" && (
            <Link href="/admin" className={`text-sm font-medium ${isActive("/admin")}`}>
              Admin
            </Link>
          )}
        </div>

        {/* Auth controls */}
        <div className="flex items-center gap-3">
          {loading ? (
            <span className="text-xs text-slate-500">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <div className="hidden flex-col text-right text-xs leading-tight sm:flex">
                <span className="font-medium text-slate-700">
                  {user?.displayName || user?.email}
                </span>
                <span className="text-[11px] uppercase tracking-wide text-slate-400">
                  {role === "admin" ? "Admin" : "Customer"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-blue-500 hover:text-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-xs font-medium text-slate-700 hover:text-blue-600"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
