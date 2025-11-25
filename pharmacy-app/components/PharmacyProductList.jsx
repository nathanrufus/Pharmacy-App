"use client";

import { useCart } from "@/context/CartContext";

export default function PharmacyProductList({ pharmacy, products }) {
  const { addItem } = useCart();

  const handleAdd = (product) => {
    addItem({
      productId: product.id,
      pharmacyId: pharmacy.id,
      name: product.name,
      price: product.price || 0,
    });
  };

  if (!products.length) {
    return (
      <p className="mt-4 text-sm text-slate-500">
        This pharmacy has no products listed yet.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {product.name}
            </h3>
            <p className="text-xs text-slate-500">
              {product.category || "Uncategorised"}
              {product.dosage ? ` • ${product.dosage}` : ""}
            </p>
            {product.healthInfo && (
              <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                {product.healthInfo}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                {typeof product.price === "number"
                  ? `£${product.price.toFixed(2)}`
                  : "Price TBC"}
              </p>
              <p className="text-xs text-slate-500">
                Stock: {product.quantity ?? "—"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAdd(product)}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={product.quantity !== undefined && product.quantity <= 0}
            >
              Add to cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
