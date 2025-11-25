"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export default function OrdersPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  if (!user) return;

  const load = async () => {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );

    const snap = await getDocs(q);

    const rawOrders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // sort client-side by createdAt desc
    rawOrders.sort((a, b) => {
      const aTs = a.createdAt?.toMillis?.() ?? 0;
      const bTs = b.createdAt?.toMillis?.() ?? 0;
      return bTs - aTs;
    });

    setOrders(rawOrders);
  };

  load();
}, [user]);


  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading orders…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-600">
          Please log in to view your orders.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          My orders
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View your current and past orders.
        </p>
      </header>

      {orders.length === 0 ? (
        <p className="text-sm text-slate-500">
          You haven&apos;t placed any orders yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Items
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total
                </th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => {
                const created =
                  o.createdAt?.toDate?.() || o.createdAt || null;
                const dateText = created
                  ? new Date(created).toLocaleString()
                  : "—";

                return (
                  <tr key={o.id}>
                    <td className="px-4 py-2 text-slate-700">
                      {dateText}
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {o.items?.length ?? 0} item(s)
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {o.status}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-800">
                      £{(o.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/orders/${o.id}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
