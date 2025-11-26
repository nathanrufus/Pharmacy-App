"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "./actions";

export default function CartPage() {
  const { user, isAuthenticated } = useAuth();
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-600">
          Please log in to view and place orders from your cart.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Your cart
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review items before placing your order.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          Your cart is empty. Browse products and add some items.
        </p>
      ) : (
        <form
          // We handle submit here and call the server action manually
          action={async (formData) => {
            setSubmitting(true);
            setError("");

            try {
              await placeOrder(formData);
              // If placeOrder redirects (recommended), code below never runs.
              // If it doesn’t, you could optionally clearCart() here.
            } catch (e) {
              console.error(e);
              setError("Something went wrong placing your order.");
              setSubmitting(false);
            }
          }}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          {/* Hidden fields for server action */}
          <input type="hidden" name="userId" value={user.uid} />
          <input
            type="hidden"
            name="items"
            value={JSON.stringify(items)}
          />

          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Product
                </th>
                <th className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Price
                </th>
                <th className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Quantity
                </th>
                <th className="py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subtotal
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={`${item.productId}-${item.pharmacyId}`}
                  className="border-b border-slate-100"
                >
                  <td className="py-2 pr-2 text-slate-800">
                    {item.name}
                  </td>
                  <td className="py-2 pr-2 text-slate-600">
                    £{(item.price || 0).toFixed(2)}
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      min={1}
                      className="w-20 rounded border border-slate-300 px-2 py-1 text-sm"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.productId,
                          item.pharmacyId,
                          Number(e.target.value || 1)
                        )
                      }
                    />
                  </td>
                  <td className="py-2 pr-2 text-right text-slate-800">
                    £{((item.price || 0) * item.quantity).toFixed(2)}
                  </td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.productId, item.pharmacyId)
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel order / Clear cart
            </button>

            <div className="text-right">
              <p className="text-sm text-slate-600">
                Total amount
              </p>
              <p className="text-xl font-semibold text-slate-900">
                £{total.toFixed(2)}
              </p>
              {error && (
                <p className="mt-1 text-xs text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Placing order..." : "Confirm order"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
