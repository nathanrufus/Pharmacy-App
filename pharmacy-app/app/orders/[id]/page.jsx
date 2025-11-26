// app/orders/[id]/page.jsx
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getOrder(id) {
  if (!id || typeof id !== "string") {
    return null;
  }

  const ref = doc(db, "orders", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data();

  // Convert timestamps to JS Dates for display
  const created =
    data.createdAt?.toDate?.() ?? data.createdAt ?? null;
  const updated =
    data.updatedAt?.toDate?.() ?? data.updatedAt ?? null;

  return {
    id: snap.id,
    ...data,
    createdAt: created,
    updatedAt: updated,
  };
}

// ✅ Default export is a React component (async server component)
export default async function OrderDetailPage({ params }) {
  // Next 16: params is a Promise
  const { id } = await params;

  const order = await getOrder(id);
  if (!order) {
    notFound();
  }

  const createdText = order.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : "—";

  const updatedText = order.updatedAt
    ? new Date(order.updatedAt).toLocaleString()
    : "—";

  const items = Array.isArray(order.items) ? order.items : [];
  const totalAmount = order.totalAmount || 0;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Order details
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Order ID: <span className="font-mono text-xs">{order.id}</span>
          </p>
        </div>

        <Link
          href="/orders"
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          ← Back to orders
        </Link>
      </header>

      {/* Summary card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Status
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {order.status || "confirmed"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Placed at
            </p>
            <p className="mt-1 text-sm text-slate-800">
              {createdText}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Last updated
            </p>
            <p className="mt-1 text-sm text-slate-800">
              {updatedText}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Total amount
          </p>
          <p className="text-xl font-semibold text-slate-900">
            £{totalAmount.toFixed(2)}
          </p>
        </div>
      </section>

      {/* Items list */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">
          Items in this order
        </h2>

        {items.length === 0 ? (
          <p className="text-sm text-slate-500">
            No items found on this order.
          </p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2 pr-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Product
                </th>
                <th className="py-2 pr-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pharmacy
                </th>
                <th className="py-2 pr-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Price
                </th>
                <th className="py-2 pr-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Quantity
                </th>
                <th className="py-2 pr-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const price = item.price || 0;
                const qty = item.quantity || 0;
                const subtotal = price * qty;

                return (
                  <tr key={`${item.productId}-${idx}`} className="border-b border-slate-100">
                    <td className="py-2 pr-2 text-slate-800">
                      {item.name || "Product"}
                    </td>
                    <td className="py-2 pr-2 text-slate-600 text-xs">
                      {item.pharmacyName || item.pharmacyId || "Pharmacy"}
                    </td>
                    <td className="py-2 pr-2 text-slate-600">
                      £{price.toFixed(2)}
                    </td>
                    <td className="py-2 pr-2 text-slate-600">
                      {qty}
                    </td>
                    <td className="py-2 pr-2 text-right text-slate-800">
                      £{subtotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
