import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import Link from "next/link";
import { createProduct, deleteProduct } from "./actions";

export const dynamic = "force-dynamic";

async function getPharmacies() {
  const snap = await getDocs(
    query(collection(db, "pharmacies"), orderBy("name"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function getProducts() {
  const snap = await getDocs(
    query(collection(db, "products"), orderBy("name"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export default async function AdminProductsPage() {
  const [pharmacies, products] = await Promise.all([
    getPharmacies(),
    getProducts(),
  ]);

  // Helper: map pharmacyId -> name for display
  const pharmacyNameMap = Object.fromEntries(
    pharmacies.map((p) => [p.id, p.name || "Unknown pharmacy"])
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage medications and health products offered by pharmacies.
          </p>
        </div>
      </header>

      {/* Create product */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">
          Add a new product
        </h2>

        <form
          action={createProduct}
          className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
        >
          <div className="md:col-span-2 lg:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Product name *
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Paracetamol 500mg tablets"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Category
            </label>
            <input
              name="category"
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Over-the-counter"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Dosage
            </label>
            <input
              name="dosage"
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 500mg"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Price (£)
            </label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2.99"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Quantity in stock
            </label>
            <input
              name="quantity"
              type="number"
              min="0"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Expiry date
            </label>
            <input
              name="expiryDate"
              type="date"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Health info / usage / side effects
            </label>
            <textarea
              name="healthInfo"
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Short description of usage, precautions and side effects."
            />
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Pharmacy *
            </label>
            <select
              name="pharmacyId"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select pharmacy…</option>
              {pharmacies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-1">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Save product
            </button>
          </div>
        </form>
      </section>

      {/* Existing products list */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">
            Existing products
          </h2>
          <p className="text-xs text-slate-500">
            {products.length} in total
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pharmacy
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Stock
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No products yet. Use the form above to add one.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {pharmacyNameMap[product.pharmacyId] || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {product.category || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {typeof product.price === "number"
                        ? `£${product.price.toFixed(2)}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {product.quantity ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-blue-500 hover:text-blue-600"
                        >
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteProduct(product.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
