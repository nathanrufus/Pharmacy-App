"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function BrowseClient({ products }) {
  const { addItem } = useCart();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const categories = useMemo(() => {
    const set = new Set(
      products
        .map((p) => p.category)
        .filter(Boolean)
    );
    return Array.from(set).sort();
  }, [products]);

  const filtered = products.filter((p) => {
    const q = query.toLowerCase();
    const matchText =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.dosage || "").toLowerCase().includes(q) ||
      (p.pharmacyName || "").toLowerCase().includes(q);
    const matchCategory = !category || p.category === category;
    return matchText && matchCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search by name, dosage, or pharmacy…"
          className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">
            No products match your search.
          </p>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {p.category || "Uncategorised"}
                  {p.dosage ? ` • ${p.dosage}` : ""}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Pharmacy: {p.pharmacyName || "Unknown"}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {typeof p.price === "number"
                      ? `£${p.price.toFixed(2)}`
                      : "Price TBC"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Stock: {p.quantity ?? "—"}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={() =>
                    addItem({
                      productId: p.id,
                      pharmacyId: p.pharmacyId,
                      name: p.name,
                      price: p.price || 0,
                    })
                  }
                  disabled={p.quantity !== undefined && p.quantity <= 0}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
